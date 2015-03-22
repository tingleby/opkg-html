/*!
 * opkg-html.js: Parses packages.json
 *
 * Copyright (c) 2015 Tom Ingleby
 * Licensed under the MIT.
 */

var packages_list;
var page_number = 0;
var per_page = 25;
var chunk_count;

var fpackages;
var searchPage = false;

function packageNameSort(a, b)
{
     var Aname = a.name.toLowerCase();
     var Bname = b.name.toLowerCase();
     if (Aname < Bname){
        return -1;
     }else if (Aname > Bname){
       return  1;
     }else{
       return 0;
     }
};

function addToTable(name,version,section,description,filename,source) {
  packages_list.append(
      "<tr data-toggle=\"collapse\" data-target=\"#"+name+"\" class=\"accordion-toggle\">"+
      "<td><button type=\"button\" class=\"btn btn-default btn-xs\" >"+
         "<span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span>"+
      "</button>"+
      "<td>"+name+"</td>"+
      "<td>"+version+"</td>"+
      "<td>"+section+"</td>"+
      "<td><button type=\"button\" class=\"btn btn-default btn-xs\""+
      "onclick=\"location.href='"+filename+"'\">"+
         "<span class=\"glyphicon glyphicon-download\" aria-hidden=\"true\"></span>"+

      "</tr><tr><td colspan=\"5\" class=\"hiddenrow\">"+
      "<div id=\""+name+"\" class=\"accordion-body panel panel-default collapse\">"+
      "<div class=\"panel-heading\"><b>Description</b></div>"+
      "<div class=\"panel-body\">"+description+"</div>"+
      "<div class=\"panel-heading\"><b>Source</b></div>"+
      "<div class=\"panel-body\">"+source+"</div>"+
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
    addToTable(p.name,p.version,p.section,p.description,p.filename,p.source);
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

var packages = new Array();

$.getJSON( "index.json", function(data) {
    chunk_count = data.length;
    $.each(data, function(i,v) {
       $.getJSON(v, function(datai) {
         packages.push.apply(packages, datai);
       })
        .fail(function() { console.log("Failed to get"+data); })
        .done(function() {
            chunk_count--;
        });

     });

    })
  .fail(function() {
    console.log( "Failed to get index.json" );
  })
  .done(function() {
    var refr = setInterval(function(){
      if(chunk_count == 0) {
        clearInterval(refr);
        packages.sort(packageNameSort);
      }
      renderTable();
    }, 100);
  });

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
