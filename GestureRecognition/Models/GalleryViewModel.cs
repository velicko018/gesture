using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestureRecognition.Models
{
    public class GalleryViewModel
    {
        public GalleryViewModel()
        {
            Photos = new List<Photo>();
        }
        public List<Photo> Photos { get; set; }
    }
}