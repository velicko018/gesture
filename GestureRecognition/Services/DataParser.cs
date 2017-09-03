using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using GestureRecognition.Models;
using System.Web.Script.Serialization;

namespace GestureRecognition.Services
{
    public class DataParser
    {
        public string File { get; set; }
        public List<Photo> Photos { get; set; }

        private string LoadFile()
        {
            using (StreamReader sr = new StreamReader(File))
            {
                var text = sr.ReadToEnd();
                if (string.IsNullOrEmpty(text))
                    return "";
                try
                {
                    Photos = new JavaScriptSerializer().Deserialize<List<Photo>>(text);
                }
                catch (Exception) { }
                return text;
            }

        }
        private void SaveFile()
        {
            using (StreamWriter sw = new StreamWriter(File))
            {
                var text = new JavaScriptSerializer().Serialize(Photos);
                sw.Write(text);
            }
        }

        public void Add(Photo photo)
        {
            Photos.Add(photo);
            SaveFile();
        }
        public Photo Get(string photoPath)
        {
            LoadFile();
            return Photos?.Where(p => p.ImagePath == photoPath)?.FirstOrDefault();
        }
    }
}