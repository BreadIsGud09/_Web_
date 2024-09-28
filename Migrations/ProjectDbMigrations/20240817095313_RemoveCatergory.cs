using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web_demo.Migrations.ProjectDbMigrations
{
    /// <inheritdoc />
    public partial class RemoveCatergory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "ProjectTable");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "Category",
                table: "ProjectTable",
                type: "text[]",
                nullable: true);
        }
    }
}
