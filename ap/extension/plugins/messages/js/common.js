function messagebox(type, title, content) {
    switch (type) {
        case "confirm":
            break;
        case "dialog":
            break;
        case "alert":
            $.alert({                    
                icon: "fa fa-info",
                columnClass: "col-md-6 col-md-offset-3",
                closeIcon: false,
                keyboardEnabled: true,
                backgroundDismiss: false,
                title: title,
                content: content,
                buttons: {
                    somethingElse: {
                        text: "<i class='fa fa-creative-commons'></i> :: {btn_continue} ::",
                        keys: ["enter", "shift"],
                        btnClass: "btn-u btn-u-green",
                        action: function(){
                        }
                    }
                }
            });
            break;
    }
}