using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GestureRecognition.Services;
using GestureRecognition.Models;

namespace GestureRecognition.Controllers
{
    public class GalleryController : Controller
    {
        private static string saveFolderUrl = "Photos\\";
        private static DataParser dataParser = new DataParser()
        {
            File = System.AppDomain.CurrentDomain.BaseDirectory + "data.txt",
            Photos = new List<Photo>()
        };

        // GET: Gallery
        public ActionResult Index()
        { 
            return View();
        }

        [HttpGet]
        public ActionResult LazyLoad(int startIndex, int endIndex)
        {
            var photos = Directory.GetFiles(System.AppDomain.CurrentDomain.BaseDirectory + saveFolderUrl, "*.png*", SearchOption.AllDirectories)
                                        .ToList();
            if (startIndex >= photos.Count)
                return Json("No more photos", JsonRequestBehavior.AllowGet);
            if (endIndex >= photos.Count)
                endIndex = photos.Count - 1;

            List<Photo> ret = new List<Photo>();

            for(int i = startIndex; i < endIndex; i++)
            {
                var photoData = dataParser.Get(photos[i]);

                ret.Add(new Photo()
                {
                    ImagePath = photos[i].Substring(photos[i].IndexOf("\\Photos")), //path treba se napravi da bude relativnu u odnosu na server
                    Date = photoData?.Date ?? DateTime.Now.ToLongDateString(),
                    Location = photoData?.Location ?? "Nis Fortress"
                });
            }
            return Json(ret, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Upload(string imageString)
        {
            
            // Convert base 64 string to byte[]
            byte[] imageBytes = Convert.FromBase64String(imageString);
            // Convert byte[] to Image
            try
            {

                using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
                {
                    Image image = Image.FromStream(ms, true);
                    image = Services.ImageProcessing.ProcessImage(new Bitmap(image));
                    var src = System.AppDomain.CurrentDomain.BaseDirectory + saveFolderUrl + "photo-" + Guid.NewGuid() + ".png";
                    image.Save(src);
                    dataParser.Add(new Photo()
                    {
                        ImagePath = src,
                        Location = "Tvrdjava Nis",
                        Date = DateTime.Now.ToLongDateString()
                    });
                    return Json(src.Substring(src.IndexOf("\\Photos")), JsonRequestBehavior.AllowGet);
                }
            }
            catch(Exception)
            {
                return Json("Error occured while reading image string", JsonRequestBehavior.AllowGet);
            }
        }

        public string ImageToBase64(Image image, System.Drawing.Imaging.ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to base 64 string
                string base64String = Convert.ToBase64String(imageBytes);
                return base64String;
            }
        }
    }
}