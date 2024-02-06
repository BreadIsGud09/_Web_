export class Client_Signal ///Sending XML Request to the server
{
    PostRequest(Url = "", data = {})///Post method
    {
        var Jsonify_Data = JSON.stringify(data)

        if(Url == "")
        {
            return new console.error("Please provide URL");
        }
        else if(Url !== "")
        {
            ////Creating new POST Request from XMLHttp
            var Request = new XMLHttpRequest();

            Request.open("POST",Url);
            Request.setRequestHeader("Content-Type","application/json");

            Request.onreadystatechange = () => {
                if(Request.readyState == 400 && Request.status == 200)
                {
                    return Request.response; ////Return server respon
                }
                else
                {
                    return "Error";
                }
                
            }
            Request.send(Jsonify_Data);/// Sending request
        }
    }
}
