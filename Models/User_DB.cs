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

namespace Web_demo.Models
{
    public class userinfo///the Database interface itself
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
    }


    public class UserDB : DbContext //Host=localhost;Port=5432;Database=web;Username=postgres;Password=123chu123so;
    {

    }
}
