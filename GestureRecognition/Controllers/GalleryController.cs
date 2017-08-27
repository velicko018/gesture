﻿using System;
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
        private static Photo LastProcessedImage = new Photo();
        private static string saveFolderUrl = "Photos\\";
        // GET: Gallery
        public ActionResult Index()
        {
            var model = new GalleryViewModel();
            var photos = Directory.GetFiles(System.AppDomain.CurrentDomain.BaseDirectory + saveFolderUrl, "*.png*", SearchOption.AllDirectories)
                .ToList();
            foreach(string photoPath in photos)
            {
                //mora se napravi baza ako ocete datum i lokaciju
                model.Photos.Add(new Photo()
                {
                    ImagePath = photoPath.Substring(photoPath.IndexOf("\\Photos")), //path treba se napravi da bude relativnu u odnosu na server
                    Date = DateTime.Now,
                    Location = "Nis kod radomira"
                });
            }
            return View(model);
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
                    LastProcessedImage = new Photo()
                    {
                        Image = ImageProcessing.ProcessImage(new Bitmap(image)),
                        Date = DateTime.Now
                    };
                    return Json(ImageToBase64(LastProcessedImage.Image, System.Drawing.Imaging.ImageFormat.Png), JsonRequestBehavior.AllowGet);
                }
            }
            catch(Exception)
            {
                return Json("Error occured while reading image string", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult Save()
        {
            try
            {
                if(LastProcessedImage != null)
                {
                    LastProcessedImage.Image.Save(System.AppDomain.CurrentDomain.BaseDirectory + saveFolderUrl + "photo-" + Guid.NewGuid() + ".png");

                    return Json("image is saved.", JsonRequestBehavior.AllowGet);
                }
            }
            catch(Exception e)
            {
                var message = e.Message;
                return Json(message, JsonRequestBehavior.AllowGet);
            }

            return Json("image is not saved.", JsonRequestBehavior.AllowGet);
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