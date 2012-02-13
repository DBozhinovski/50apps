var AppRouter = Backbone.Router.extend({

	view : "",

	routes: {
        "add-note/" : "form",
        "edit-note/:id" : "form",
        "show-notes/" : "showNotes"
    },
    
    showNotes: function(){
    	
    	$("#overlay").hide();
    	$("#modal").hide();
    	
    	this.view = new BoardView();
    	this.view.render();
    	
    },	
    
    form: function(id) {
        
        if(id){
        	this.view = new FormView(id);
        } else {
        	this.view = new FormView();
        }
       
        this.view.showForm();
        
    }
        
});

var FormView = Backbone.View.extend({

	notes : "",
	
	id : "",

	initialize : function(id){
		
		this.notes = new StickyNotes();
		this.notes.getNotes();
		
		if(id){
		
			$("#modal h3").text("Edit note");
			
			this.id = id;
		
		} else {
			
			var note = new StickyNote();
			
			this.notes.add(this.note);
			
			this.id = note.get("id");
			
			$("#modal h3").text("Add note");
			
		}
		
	},
	
	showForm : function(){
		
		$("#note-title").val(this.notes.get(this.id).get("title"));
		
		$("#note-content").val(this.notes.get(this.id).get("content"));
		
		$("#note-swatch").val(this.notes.get(this.id).get("swatch"));
		
		$("#overlay").fadeIn(300);
		$("#modal").fadeIn(300);
		
		this.bind();
		
	},
	
	hideForm : function(){
	
		$("#overlay").fadeOut(300);
		$("#modal").fadeOut(300);
		
	},
	
	bind : function(){
	
		var parent = this;
	
		$("#modal").find("button").on("click", function(event){
		
			var action = $(this).attr("data-action");
		
		
			if(action === "store"){
				
				var titleVal = $("#note-title").val();
				var contentVal = $("#note-content").val();
				var swatchVal = $("#note-swatch").val();
			
				if(titleVal && contentVal && swatchVal){
			
					parent.notes.get(parent.id).set("title", titleVal);
			
					parent.notes.get(parent.id).set("content", contentVal);
			
					parent.notes.get(parent.id).set("swatch", swatchVal);
			
					parent.notes.store();
				
					parent.hideForm();
			
					window.location.hash = "#/show-notes/";
			
				} else {
					
					alert("Please complete the form before submitting.");
					
				}
				
			}
			
			if(action === "close"){
			
					parent.hideForm();
			
					window.location.hash = "#/show-notes/";	
				
			}
			
			
		});
		
		$("#overlay").on("click", function(event){
			
			parent.hideForm();
			
			window.location.hash = "#/show-notes/";	
			
		});
	
	}

});

var BoardView = Backbone.View.extend({

	noteTemplate : "",
	
	notes : "",

	initialize : function(){
		
		this.noteTemplate = '<div class="note <%= swatch %>" id="<%= id %>" style="<%= position %>"><div class="controls"><button data-action="delete" data-id="<%= id %>"><span class="icon glyphicons cancel"></span></button><button data-action="edit" data-id="<%= id %>"><span class="icon glyphicons pencil"></span></button></div><h3 class="title"><%= title %><br/><small><%= time %></small></h3><article class="content"><%= content %></article></div>';
		this.notes = new StickyNotes(); 
		
		
	},
	
	render : function(){
	
		notesData = this.notes.getNotes();
		
		//console.log(notesData);
		
		if(notesData.length === 0){
			
			$("#canvas").html("<p>No sticky notes found. Add one first.</p>");
			
		} else {
			
			var output = "";
			var templateCompiler = _.template(this.noteTemplate);
			
			for(var i = 0, size = notesData.length; i < size; i++){
				
				output += templateCompiler(notesData[i]);
				
			}
			
			$("#canvas").html(output);
			
			this.bind();
			
		}
	
	},
	
	bind : function(){
	
		var root = 0;
		var parent = this;
		
		//console.log(parent.notes);
	
		//fix height because of positioning
		$("#canvas").height($(window).height() - 50);
		
		var notes = $("#canvas").find(".note");
		
		notes.draggable({ 
			containment: "#canvas", 
			scroll: false,
			start: function(event, ui) { $(this).css("z-index", root ++); },
			stop: function(event, ui) {
				
				var id = $(this).attr("id");
				
				parent.notes.get(id).set("position", $(this).attr("style"));
				
				parent.notes.store();
				
			},
			cancel: 'button'
		});
		
		notes.find("button").on("click", function(event){
			
			var type = $(this).attr("data-action");
			var id = $(this).attr("data-id");
			
			if(type === "edit"){
				window.location.hash = "/edit-note/" + id;
			}
			
			if(type === "delete"){
				var item = parent.notes.get(id);
				parent.notes.remove(item);
				
				$("#" + id).fadeOut(300, function(){
					$(this).remove();
				});
				
				parent.notes.store();
			}
			
			
		});
		
		notes.on("click", function(event){
			
			event.stopPropagation();
			
			$(this).addClass('top').removeClass('bottom');
        	$(this).siblings().removeClass('top').addClass('bottom');
        	$(this).css("z-index", root++);
			
		});
	
	},
	
	redraw : function(){
		
	}

});

var StickyNote = Backbone.Model.extend({

	defaults: {
		"id" : new Date().getTime(),
		"title" : "",
		"content" : "",
		"swatch" : "yellow",
		"position" : "top: 100px; left: 200px; z-index: 99;",
		"time" : new Date()
	}

});

var StickyNotes = Backbone.Collection.extend({

	model : StickyNote,
	
	initialize : function(){	
	
		if(!localStorage.getItem("notes")){
			localStorage.setItem("notes",'{"notes":[]}');
		}
	
	},
	
	getNotes : function(){
		
		var data = JSON.parse(localStorage.getItem("notes"));
		this.add(data.notes);
		return data.notes;
		
	},
	
	store : function(){
		
		storeData = '{"notes":'+JSON.stringify(this.toJSON())+'}';
		
		localStorage.setItem("notes", storeData);
		
	}

});

$(function(){

	var router = new AppRouter();
	Backbone.history.start();
	
	window.location.href="#/show-notes/";
	
});

