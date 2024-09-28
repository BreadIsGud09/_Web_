export class LayoutManager {
    SavedLayout = [] ///Saved layout Stats
    Defualt = {};
    /**@type {HTMLDivElement} */
    Layout_Container;

    constructor(DefualtLayoutObj = {
        Name: "Defualt",
        Row: "",
        Coll: ""
    }, Container = Element) {
        this.Defualt = DefualtLayoutObj;////Set the defualt layout to 
        this.Layout_Container = Container;


        this.SavedLayout.push(this.Defualt);////Push the defualt into the table
        this.#SetDefaultLayout();///Set the Defualt layout
    }


    #SetDefaultLayout()///Set the Defualt properties to the Layout 
    {
        this.Layout_Container.style.display = "grid";
        this.Layout_Container.style.gridTemplateRows = this.Defualt.Row;
        this.Layout_Container.style.gridTemplateCollums = this.Defualt.Coll;
    }

    Push(layout_id = "", Rows = "", Collums = "")///Push the Layout Stats to arr 
    {
        const LayoutObj = {
            Name: layout_id,
            Row: Rows,
            Coll: Collums
        }

        this.SavedLayout.push(LayoutObj);

        return LayoutObj;
    }

    Set(MatchingId = "", Addition = new Object())///Set the layout to specific layout
    {
        this.SavedLayout.forEach((Obj) =>
        {
            if (Obj.Name == MatchingId) {
                try {
                    this.Layout_Container.style.display = "grid";
                    this.Layout_Container.style.gridTemplateRows = Obj.Row;
                    this.Layout_Container.style.gridTemplateColumns = Obj.Coll;
                }
                catch (error) { console.error(error) }
                return;
            }
            else {
                return "Not Found";
            }
        })
    }
}