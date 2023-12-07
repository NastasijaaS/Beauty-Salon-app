using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System;
namespace Models
{

    [Table("Radnik")]
    public class Radnik
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Ime { get; set; }

        [Required]
        [MaxLength(50)]
        public string Prezime { get; set; }

        [Range(5, 10)]
        public float Ocena { get; set; }

        public DateTime DatumZap { get; set; }

        [JsonIgnore]

        public Salon Salon {get; set;}

        [JsonIgnore]


        public virtual List<Usluga> Usluge { get; set; }
    }
}