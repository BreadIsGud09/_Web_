export class LayoutManager
{
    SavedLayout = [] ///Saved layout Stats
    Defualt = {};
    Layout_Container = Element;

    constructor(DefualtLayoutObj =  {
        Name: "Defualt",
        Row: "",
        Coll: ""
    }, Container = Element)
    {
        this.Defualt = DefualtLayoutObj;
        this.Layout_Container = Container; 
    }


    SetDefaultLayout()///Set the Defualt properties to the Layout 
    {
        this.Layout_Container.style.display = "grid";
        this.Layout_Container.style.gridTemplateRows = Obj.Row;
        this.Layout_Container.style.gridTemplateCollums = Obj.Coll;
    }

    Push(layout_id = "",Rows = "",Collums = "")///Push the Layout Stats to arr 
    {
        const LayoutObj = {
            Name: layout_id,
            Row: Rows,
            Coll: Collums
        }

        this.SavedLayout.push(LayoutObj);

        return LayoutObj;
    }

    Set(MatchingId = "")///Set the layout to specific layout
    {
        this.SavedLayout.forEach((Obj) =>
        {
            if (Obj.Name == MatchingId) {
                try {
                    this.Layout_Container.style.display = "grid";
                    this.Layout_Container.style.gridTemplateRows = Obj.Row;
                    this.Layout_Container.style.gridTemplateCollums = Obj.Coll;
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