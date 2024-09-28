export class Polling ///Sending XML Request to the server
{
    #Secret_Url;

    /**
     * 
     * @param {string} DefualtUrl
     */
    constructor(DefualtUrl = "")
    {
        this.#Secret_Url = DefualtUrl;
    }


    set NewDirectory(values = "") {
        this.#Secret_Url = values;
    }

    /**
     * 
     * @param {{}} data
     * @returns {Promise}
     */
    async PostRequest(data = {})///Post method
    {
        var Jsonify = JSON.stringify(data);
        console.log(Jsonify);

        var PolledRespone = await fetch(this.#Secret_Url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: Jsonify
        });

        if (PolledRespone.ok) {
            return PolledRespone.json(); 
        }
        else if (!PolledRespone.ok) {
            return new Error(PolledRequest.status);
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
