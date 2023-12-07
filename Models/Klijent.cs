using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Models
{

    [Table("Klijent")]
    public class Klijent
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Ime { get; set; }

        [Required]
        [MaxLength(50)]
        public string Prezime { get; set; }

        [Required]
        [MaxLength(13)]
        [RegularExpression("\\d+")]
        public string BrojTelefonaKlijenta { get; set; }

        [MaxLength(50)]
        [RegularExpression("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")]
        public string EmailKlijenta {get; set;}


        public Salon Salon {get; set;}

        [JsonIgnore]


        public virtual List<Koristi> ListaUsluga {get; set;}



    }
}