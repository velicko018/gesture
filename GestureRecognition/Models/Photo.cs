using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;

namespace GestureRecognition.Models
{
    public class Photo
    {
        public string ImagePath { get; set; }
        public Image Image { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; }
    }
}