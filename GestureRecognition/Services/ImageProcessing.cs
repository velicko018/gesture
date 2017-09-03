using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;
using System.IO;

namespace GestureRecognition.Services
{
    public class ImageProcessing
    {

        public static Image ProcessImage(Bitmap image)
        {
            var original = new Bitmap(image); //COPY constructor da ne bi menjao originalnu instancu
            
            string[] landscapePaths = Directory.GetFiles(System.AppDomain.CurrentDomain.BaseDirectory + "Content\\pictures\\landscape\\"); //liste slika
            string[] portraitPaths = Directory.GetFiles(System.AppDomain.CurrentDomain.BaseDirectory + "Content\\pictures\\portrait\\");

            Random r = new Random();
            int seed=r.Next(0, landscapePaths.Count());
            var lanscapeImage = new Bitmap(landscapePaths[seed]); //random landscape slika

            seed = r.Next(0, portraitPaths.Count());
            var portraitImage = new Bitmap(portraitPaths[seed]); //random portrait slika

            Bitmap bitmap = new Bitmap(2150, 1480); //finalna slika
            using (Graphics g = Graphics.FromImage(bitmap))
            {
                // g.DrawRectangle(new Pen(Brushes.Green, 10), new Rectangle(0, 0, bitmap.Width, bitmap.Height));
                g.DrawImage(portraitImage, new Rectangle(20, 20, 810, 1440), new Rectangle(0, 0, portraitImage.Width, portraitImage.Height), GraphicsUnit.Pixel); //crta portret sliku
                g.DrawImage(lanscapeImage, new Rectangle(850, 740, 1280, 720), new Rectangle(0, 0, lanscapeImage.Width, lanscapeImage.Height), GraphicsUnit.Pixel); //crta landscape sliku
                g.DrawImage(original, new Rectangle(850, 20, 1280, 720), new Rectangle(0, 0, original.Width, original.Height), GraphicsUnit.Pixel); //crta original na odredjenu pozociju nove slike
            }
      
            return bitmap;
        }
    }
}