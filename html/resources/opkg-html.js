/*!
 * opkg-html.js: Parses packages.json
 *
 * Copyright (c) 2015 Tom Ingleby
 * Licensed under the MIT.
 */

var packages_list;
var page_number = 0;
var per_page = 25;

var fpackages;
var searchPage = false;

function addToTable(name,version,section,description) {
  packages_list.append(
      "<tr data-toggle=\"collapse\" data-target=\"#"+name+"\" class=\"accordion-toggle\">"+
      "<td><button type=\"button\" class=\"btn btn-default btn-xs\" >"+
         "<span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span>"+
      "</button>"+
      "<td>"+name+"</td>"+
      "<td>"+version+"</td>"+
      "<td>"+section+"</td>"+
      "</tr><tr><td colspan=\"4\" class=\"hiddenrow\">"+
      "<div id=\""+name+"\" class=\"accordion-body panel panel-default collapse\">"+
      "<div class=\"panel-heading\"><b>Description</b></div>"+
      "<div class=\"panel-body\">"+description+"</div>"+
      "</div></td></tr>"
      );
};

function renderTable() {
  var start_i = page_number * per_page;
  var l;
  if (searchPage) {
    l = fpackages;
  } else {
    l = packages;
  }
  packages_list.empty();
  jQuery.each(l.slice(start_i, (start_i + per_page)), function(i,p) {
    addToTable(p.name,p.version,p.section,p.description);
  });
}

var ll;

function doSearch(term) {
    var filtered = [];
    jQuery.each(packages, function(i,p) {
      if (p.name.indexOf(term) != -1 ){
        filtered.push(p);
        return;
      }
    });
    fpackages = filtered;
    renderTable();
}

var packages = (function() {
        $.ajax({
            'url': "packages.json",
            'dataType': "json",
            'success': function (data) {
                packages = data;
                console.log("Done loading JSON");
                renderTable();
            },
            'statusCode': {
                404: function() {
                  alert("package.json not found");
                }
            }
        });
    })();

$(document).ready(function() {
   packages_list = $("#packages");
   console.log("OPKG-HTML-JS: Started");

   $("#previous").click(function() {
     if (page_number != 0) {
        page_number--;
        renderTable();
      }
   });

   $("#next").click(function() {
     if (searchPage) {
        if (page_number != Math.ceil((fpackages.length / per_page))) {
          if (fpackages.length <= per_page) {
            return;
          }
          page_number++;
          renderTable();
        }
     } else {
        if (page_number != Math.ceil((packages.length / per_page))) {
          if (packages.length <= per_page) {
            return;
          }
          page_number++;
          renderTable();
        }
     }
   });

   $("#search").keyup(function(){
     page_number = 0;
     if($(this).val()) {
       searchPage = true;
       doSearch($(this).val().toLowerCase());
       return;
     }
     searchPage = false;
     renderTable();

   });
});
