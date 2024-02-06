using Npgsql;
using Microsoft.AspNetCore;
using System.Runtime.CompilerServices;
using System.Net;
using System.Collections.Generic;
using System;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;


namespace Web_demo.Models
{
    public class Userinfo///the Database interface itself
    {
        [Required]
        public string? username { get; set; }
        [Required]
        public string? email { get; set; }
        public int id { get; set; }
        [Required]
        public string? emailkey { get; set; }
        [Required]
        public string? status { get; set; }
        [Required]
        public string? Cookies_ID { get; set; }
        
        public JsonDocument? user_project { get; set; }
    }


    public class UserDB : DbContext //Host=localhost;Port=5432;Database=_Web_;Username=postgres;Password=123123123;
    {
        public UserDB(DbContextOptions<UserDB> options) : base(options) { }

        public DbSet<Userinfo> userinfo { get; set; }///Table
    }

}
