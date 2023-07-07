using Web_demo.Models;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Microsoft.Extensions.DependencyInjection;
using Web_demo.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<UserDB>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("web"));
});

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IEmail_Sender,Email_Handler>();
builder.Services.AddTransient<IDB_Services,Database_Handler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Shared/Error");

    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}



app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Visitor}/{action=Index}/{id?}");

    app.MapControllerRoute(
        name: "MainPage",
        pattern: "{controller=MainPage}/{action=Main}/{user?}"
        );

});

app.Run();
