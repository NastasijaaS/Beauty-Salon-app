using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System;
namespace Models
{

    [Table("Koristi")]
    public class Koristi
    {
        [Key]
        public int ID { get; set; }

        public virtual Klijent Klijent { get; set; }

        public virtual Usluga Usluga { get; set; }

        public DateTime Datum { get; set; }

        
    }
}