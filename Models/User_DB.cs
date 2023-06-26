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
    public class CurrentTable///the Database interface itself
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
        public UserDB(DbContextOptions<UserDB> options) : base(options)
        {
            
        }

        private DbSet<CurrentTable> Orgin_DB { get; set; }/// <summary>
        /// Oringin DB is to handle request from here to Database
        /// </summary>




        public bool AddValuesTo(List<object> ValuesToAdd)//Insert
        {
            bool st = false;

            try
            {
                var Items = new CurrentTable()
                {
                    username = ValuesToAdd[0].ToString(),
                    email = ValuesToAdd[1].ToString(),
                    emailkey = ValuesToAdd[2].ToString(),
                    status = ValuesToAdd[3].ToString(),
                };

                Orgin_DB.Add(Items);

                this.SaveChanges();
                st = true;
            }
            catch (Exception ex) 
            { 
                st = false;
            }
            

            return st;
        }

    }
}
