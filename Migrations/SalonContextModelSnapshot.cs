﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Models;

namespace SALONI.Migrations
{
    [DbContext(typeof(SalonContext))]
    partial class SalonContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.12")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Models.Klijent", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("BrojTelefonaKlijenta")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("EmailKlijenta")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Ime")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Prezime")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int?>("SalonID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("SalonID");

                    b.ToTable("Klijent");
                });

            modelBuilder.Entity("Models.Koristi", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.Property<int?>("KlijentID")
                        .HasColumnType("int");

                    b.Property<int?>("UslugaID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("KlijentID");

                    b.HasIndex("UslugaID");

                    b.ToTable("Koristi");
                });

            modelBuilder.Entity("Models.Radnik", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("DatumZap")
                        .HasColumnType("datetime2");

                    b.Property<string>("Ime")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<float>("Ocena")
                        .HasColumnType("real");

                    b.Property<string>("Prezime")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int?>("SalonID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("SalonID");

                    b.ToTable("Radnik");
                });

            modelBuilder.Entity("Models.Salon", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Naziv")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Tip")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("ID");

                    b.ToTable("Salon");
                });

            modelBuilder.Entity("Models.Usluga", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Cena")
                        .HasColumnType("int");

                    b.Property<string>("Naziv")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int?>("RadnikID")
                        .HasColumnType("int");

                    b.Property<int>("SalonID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("RadnikID");

                    b.HasIndex("SalonID");

                    b.ToTable("Usluga");
                });

            modelBuilder.Entity("Models.Klijent", b =>
                {
                    b.HasOne("Models.Salon", "Salon")
                        .WithMany("Klijenti")
                        .HasForeignKey("SalonID");

                    b.Navigation("Salon");
                });

            modelBuilder.Entity("Models.Koristi", b =>
                {
                    b.HasOne("Models.Klijent", "Klijent")
                        .WithMany("ListaUsluga")
                        .HasForeignKey("KlijentID");

                    b.HasOne("Models.Usluga", "Usluga")
                        .WithMany("ListaKlijenta")
                        .HasForeignKey("UslugaID");

                    b.Navigation("Klijent");

                    b.Navigation("Usluga");
                });

            modelBuilder.Entity("Models.Radnik", b =>
                {
                    b.HasOne("Models.Salon", "Salon")
                        .WithMany("Radnici")
                        .HasForeignKey("SalonID");

                    b.Navigation("Salon");
                });

            modelBuilder.Entity("Models.Usluga", b =>
                {
                    b.HasOne("Models.Radnik", "Radnik")
                        .WithMany("Usluge")
                        .HasForeignKey("RadnikID");

                    b.HasOne("Models.Salon", "Salon")
                        .WithMany("Usluge")
                        .HasForeignKey("SalonID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Radnik");

                    b.Navigation("Salon");
                });

            modelBuilder.Entity("Models.Klijent", b =>
                {
                    b.Navigation("ListaUsluga");
                });

            modelBuilder.Entity("Models.Radnik", b =>
                {
                    b.Navigation("Usluge");
                });

            modelBuilder.Entity("Models.Salon", b =>
                {
                    b.Navigation("Klijenti");

                    b.Navigation("Radnici");

                    b.Navigation("Usluge");
                });

            modelBuilder.Entity("Models.Usluga", b =>
                {
                    b.Navigation("ListaKlijenta");
                });
#pragma warning restore 612, 618
        }
    }
}
