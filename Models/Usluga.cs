using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Models
{

    [Table("Usluga")]
    public class Usluga
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Naziv { get; set; }

        [Required]
        [Range(0, 10000)]
        public int Cena { get; set; }

        [Required]
        [JsonIgnore]
        public Salon Salon { get; set; }


        [JsonIgnore]

        public virtual Radnik Radnik { get; set; }

        [JsonIgnore]

        public virtual List<Koristi> ListaKlijenta { get; set; }

    }
}