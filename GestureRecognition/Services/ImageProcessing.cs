using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;

namespace GestureRecognition.Services
{
    public class ImageProcessing
    {
        public static Image ProcessImage(Bitmap image)
        {
            var bitmap = new Bitmap(image); //COPY constructor da ne bi menjao originalnu instancu

            using (Graphics g = Graphics.FromImage(bitmap))
            {
                g.DrawRectangle(new Pen(Brushes.Green, 10), new Rectangle(0, 0, bitmap.Width, bitmap.Height));
            }

            return bitmap;
        }
    }
}