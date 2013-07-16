$(document).ready(function (){
	Array.prototype.getUnique = function(){
	  var u = {}, a = [];
	  for(var i = 0, l = this.length; i < l; ++i){
		 if(u.hasOwnProperty(this[i])) {
			continue;
		 }
		 a.push(this[i]);
		 u[this[i]] = 1;
	  }
	  return a;
	}
	RegExp.escape = function(text) {
	  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
    var linkFind = function() {
		try {
		var jq = $('.content');
		var t = jq.html().match(/"http.*"/g)
		console.log(t);
			t = t.getUnique();
		console.log(t)
		$.each(t, function (key, dat) {
			try {
				var reg = RegExp(RegExp.escape(dat), "g")
				jq.html(jq.html().replace(reg, "<a href=" + dat + " target='_blank' >" + dat + "</a>"));
			} catch(err) {
				console.log(err);
			}
		});
		} catch (error) {
			console.log(error);
		}
    }
	var lib = localStorageDB("tabeeb", localStorage);
	if (lib.isNew()){
		lib.createTable("typeahead", ["substance", "condition", "disease", "data"]);
		lib.insert("typeahead", {substance: "", condition: "", disease: "", data: ""});
		lib.commit();
	}
	var dat = lib.query("typeahead", {ID: 1})[0];
	console.log(dat);
	$('.substance').val(dat.substance);
	$('.condition').val(dat.condition);
	$('.disease').val(dat.disease);
	$('.content').html(dat.data);
	linkFind();
    var type = $('.substance').typeahead({
        name: 'substance',
		limit: 20,
        valueKey: 'substance',
        remote: '/tab_api/search/substance/%QUERY'
    });
    var condition = $('.condition').typeahead({
		name: 'conditions',
		limit: 20,
		valueKey: 'name',
		remote: '/tab_api/search/condition/%QUERY'
    });
    var disease = $('.disease').typeahead({
    	name: 'disease',
		limit: 20,
		valueKey: 'name',
		remote: '/tab_api/search/disease/%QUERY'
    });
    type.on('typeahead:selected', function(evt, data){
            $.getJSON('/tab_api/searchexact/substance/"' + encodeURI(type.val()) + '"', function(data){
                $('.content').text(JSON.stringify(data, null, 2));
            });
    });
    type.on('typeahead:autocompleted', function(evt, data){
            $.getJSON('/tab_api/searchexact/substance/"' + encodeURI(type.val()) + '"', function(data){
                $('.content').text(JSON.stringify(data, null, 2));
            });
    });
    type.keyup(function (e) {
            $.getJSON('/tab_api/searchexact/substance/"' + encodeURI(type.val()) + '"', function(data){
                $('.content').text(JSON.stringify(data, null, 2));
				lib.insertOrUpdate("typeahead", {ID: 1}, {condition: dat.condition, disease: dat.disease, substance: type.val(), data: JSON.stringify(data, null, 2)});
				lib.commit();
				dat = lib.query("typeahead", {ID: 1})[0];
            });
    })
    condition.on('typeahead:selected', function(evt, data){
	    $.getJSON('/tab_api/searchexact/condition/"' + encodeURI(condition.val()) + '"', function(data){
			$('.content').text(JSON.stringify(data, null, 2));
			linkFind();
	    });
    });
    condition.on('typeahead:autocompleted', function(evt, data){
	    $.getJSON('/tab_api/searchexact/condition/"' + encodeURI(condition.val()) + '"', function(data){
			$('.content').text(JSON.stringify(data, null, 2));
			linkFind();
	    });
    });
    condition.keyup(function (e) {
		$.getJSON('/tab_api/searchexact/condition/"' + encodeURI(condition.val()) + '"', function(data){
			$('.content').text(JSON.stringify(data, null, 2));
			linkFind();
			lib.insertOrUpdate("typeahead", {ID: 1}, {condition: condition.val(), disease: dat.disease, substance: dat.substance, data: JSON.stringify(data, null, 2)});
			lib.commit();
			dat = lib.query("typeahead", {ID: 1})[0];
		});
    })
    disease.on('typeahead:selected', function(evt, data){
		$.getJSON('/tab_api/searchexact/disease/"' + encodeURI(disease.val()) + '"', function(data){
			$('.content').text(JSON.stringify(data, null, 2));
			linkFind();
		});
    });
    disease.on('typeahead:autocompleted', function(evt, data){
        $.getJSON('/tab_api/searchexact/disease/"' + encodeURI(disease.val()) + '"', function(data){
            $('.content').text(JSON.stringify(data, null, 2));
			linkFind();
        });
    });
    disease.keyup(function (e) {
        $.getJSON('/tab_api/searchexact/disease/"' + escape(disease.val()) + '"', function(data){
            $('.content').text(JSON.stringify(data, null, 2));
			linkFind();
			lib.insertOrUpdate("typeahead", {ID: 1}, {condition: dat.condition, disease: disease.val(), substance: dat.substance, data: JSON.stringify(data, null, 2)});
			lib.commit();
			dat = lib.query("typeahead", {ID: 1})[0];
        });
    })
});
