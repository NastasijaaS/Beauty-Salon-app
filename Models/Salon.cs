using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace Models
{

    [Table("Salon")]
    public class Salon
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Naziv { get; set; }

        [MaxLength(50)]
        public string Tip { get; set; }

        [JsonIgnore]
 
        public virtual List<Usluga> Usluge { get; set; }

        [JsonIgnore]

        public virtual List<Klijent> Klijenti{get; set;}

        [JsonIgnore]

        public virtual List<Radnik> Radnici{get; set;}


    }
}