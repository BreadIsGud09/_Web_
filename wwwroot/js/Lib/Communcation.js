export class Polling ///Sending XML Request to the server
{
    #Secret_Url;

    constructor(DefualtUrl = "")
    {
        this.#Secret_Url = DefualtUrl;
    }


    set NewDirectory(values = "") {
        this.#Secret_Url = values;
    }

    /**
     * 
     * @param {object} data
     * @returns status
     */
    PostRequest(data = {})///Post method
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

    async GetRequest() { //Return a JSONfy promises 
        var polledRespone = await fetch(this.#Secret_Url, { method: "GET" });

        if (polledRespone.ok) {
            return polledRespone.json();
        }
        else if (!polledRespone.ok) {
            return new Error(polledRespone.status);
        }
    }

}
