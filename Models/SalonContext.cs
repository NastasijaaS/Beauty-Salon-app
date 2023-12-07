using Microsoft.EntityFrameworkCore;

namespace Models
{

    public class SalonContext : DbContext
    {

        public DbSet<Salon> Saloni { get; set; }

        public DbSet<Usluga> Usluge { get; set; }

        public DbSet<Koristi> KoristiUslugu { get; set; }

        public DbSet<Radnik> Radnici { get; set; }

        public DbSet<Klijent> Klijenti { get; set; }

        public SalonContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}