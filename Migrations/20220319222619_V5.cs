using Microsoft.EntityFrameworkCore.Migrations;

namespace SALONI.Migrations
{
    public partial class V5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SalonID",
                table: "Radnik",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Radnik_SalonID",
                table: "Radnik",
                column: "SalonID");

            migrationBuilder.AddForeignKey(
                name: "FK_Radnik_Salon_SalonID",
                table: "Radnik",
                column: "SalonID",
                principalTable: "Salon",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Radnik_Salon_SalonID",
                table: "Radnik");

            migrationBuilder.DropIndex(
                name: "IX_Radnik_SalonID",
                table: "Radnik");

            migrationBuilder.DropColumn(
                name: "SalonID",
                table: "Radnik");
        }
    }
}
