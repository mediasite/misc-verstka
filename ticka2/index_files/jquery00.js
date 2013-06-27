jQuery.autocomplete=function(input,options){var me=this;var $input=jQuery(input).attr("autocomplete","off");if(options.inputClass)$input.addClass(options.inputClass);var results=document.createElement("div");var $results=jQuery(results);$results.hide().addClass(options.resultsClass).css("position","absolute");if(options.width>0)$results.css("width",options.width);jQuery("body").append(results);input.autocompleter=me;var timeout=null;var prev="";var active=-1;var cache={};var keyb=false;var hasFocus=false;var lastKeyPressCode=null;function flushCache(){cache={};cache.data={};cache.length=0};flushCache();if(options.data!=null){var sFirstChar="",stMatchSets={},row=[];if(typeof options.url!="string")options.cacheLength=1;for(var i=0;i<options.data.length;i++){row=((typeof options.data[i]=="string")?[options.data[i]]:options.data[i]);if(row[0].length>0){sFirstChar=row[0].substring(0,1).toLowerCase();if(!stMatchSets[sFirstChar])stMatchSets[sFirstChar]=[];stMatchSets[sFirstChar].push(row)}}for(var k in stMatchSets){options.cacheLength++;addToCache(k,stMatchSets[k])}}$input.keydown(function(e){lastKeyPressCode=e.keyCode;switch(e.keyCode){case 38:e.preventDefault();moveSelect(-1);break;case 40:e.preventDefault();moveSelect(1);break;case 9:case 13:if(selectCurrent()){$input.get(0).blur();e.preventDefault()}break;default:active=-1;if(timeout)clearTimeout(timeout);timeout=setTimeout(function(){onChange()},options.delay);break}}).focus(function(){hasFocus=true}).blur(function(){hasFocus=false;hideResults()});hideResultsNow();function onChange(){if(lastKeyPressCode==46||(lastKeyPressCode>8&&lastKeyPressCode<32))return $results.hide();var v=$input.val();if(v==prev)return;prev=v;if(v.length>=options.minChars){$input.addClass(options.loadingClass);requestData(v)}else{$input.removeClass(options.loadingClass);$results.hide()}};function moveSelect(step){var lis=jQuery("li",results);if(!lis)return;active+=step;if(active<0){active=0}else if(active>=lis.size()){active=lis.size()-1}lis.removeClass("ac_over");jQuery(lis[active]).addClass("ac_over")};function selectCurrent(){var li=jQuery("li.ac_over",results)[0];if(!li){var $li=jQuery("li",results);if(options.selectOnly){if($li.length==1)li=$li[0]}else if(options.selectFirst){li=$li[0]}}if(li){selectItem(li);return true}else{return false}};function selectItem(li){if(!li){li=document.createElement("li");li.extra=[];li.selectValue=""}var v=jQuery.trim(li.selectValue?li.selectValue:li.innerHTML);input.lastSelected=v;prev=v;$results.html("");$input.val(v);hideResultsNow();if(options.onItemSelect)setTimeout(function(){options.onItemSelect(li)},1)};function createSelection(start,end){var field=$input.get(0);if(field.createTextRange){var selRange=field.createTextRange();selRange.collapse(true);selRange.moveStart("character",start);selRange.moveEnd("character",end);selRange.select()}else if(field.setSelectionRange){field.setSelectionRange(start,end)}else{if(field.selectionStart){field.selectionStart=start;field.selectionEnd=end}}field.focus()};function autoFill(sValue){if(lastKeyPressCode!=8){$input.val($input.val()+sValue.substring(prev.length));createSelection(prev.length,sValue.length)}};function showResults(){var pos=findPos(input);var iWidth=(options.width>0)?options.width:$input.width();$results.css({width:parseInt(iWidth)+"px",top:(pos.y+input.offsetHeight)+"px",left:pos.x+"px"}).show()};function hideResults(){if(timeout)clearTimeout(timeout);timeout=setTimeout(hideResultsNow,200)};function hideResultsNow(){if(timeout)clearTimeout(timeout);$input.removeClass(options.loadingClass);if($results.is(":visible")){$results.hide()}if(options.mustMatch){var v=$input.val();if(v!=input.lastSelected){selectItem(null)}}};function receiveData(q,data){if(data){$input.removeClass(options.loadingClass);results.innerHTML="";if(!hasFocus||data.length==0)return hideResultsNow();if(jQuery.browser.msie){$results.append(document.createElement('iframe'))}results.appendChild(dataToDom(data));if(options.autoFill&&($input.val().toLowerCase()==q.toLowerCase()))autoFill(data[0][0]);showResults()}else{hideResultsNow()}};function parseData(data){if(!data)return null;var parsed=[];var rows=data.split(options.lineSeparator);for(var i=0;i<rows.length;i++){var row=jQuery.trim(rows[i]);if(row){parsed[parsed.length]=row.split(options.cellSeparator)}}return parsed};function dataToDom(data){var ul=document.createElement("ul");var num=data.length;if((options.maxItemsToShow>0)&&(options.maxItemsToShow<num))num=options.maxItemsToShow;for(var i=0;i<num;i++){var row=data[i];if(!row)continue;var li=document.createElement("li");if(options.formatItem){li.innerHTML=options.formatItem(row,i,num);li.selectValue=row[0]}else{li.innerHTML=row[0];li.selectValue=row[0]}var extra=null;if(row.length>1){extra=[];for(var j=1;j<row.length;j++){extra[extra.length]=row[j]}}li.extra=extra;ul.appendChild(li);jQuery(li).hover(function(){jQuery("li",ul).removeClass("ac_over");jQuery(this).addClass("ac_over");active=jQuery("li",ul).indexOf(jQuery(this).get(0))},function(){jQuery(this).removeClass("ac_over")}).click(function(e){e.preventDefault();e.stopPropagation();selectItem(this)})}return ul};function requestData(q){if(!options.matchCase)q=q.toLowerCase();var data=options.cacheLength?loadFromCache(q):null;if(data){receiveData(q,data)}else if((typeof options.url=="string")&&(options.url.length>0)){jQuery.get(makeUrl(q),function(data){data=parseData(data);addToCache(q,data);receiveData(q,data)})}else{$input.removeClass(options.loadingClass)}};function makeUrl(q){var url=options.url+"?q="+encodeURI(q);for(var i in options.extraParams){url+="&"+i+"="+encodeURI(options.extraParams[i])}return url};function loadFromCache(q){if(!q)return null;if(cache.data[q])return cache.data[q];if(options.matchSubset){for(var i=q.length-1;i>=options.minChars;i--){var qs=q.substr(0,i);var c=cache.data[qs];if(c){var csub=[];for(var j=0;j<c.length;j++){var x=c[j];var x0=x[0];if(matchSubset(x0,q)){csub[csub.length]=x}}return csub}}}return null};function matchSubset(s,sub){if(!options.matchCase)s=s.toLowerCase();var i=s.indexOf(sub);if(i==-1)return false;return i==0||options.matchContains};this.flushCache=function(){flushCache()};this.setExtraParams=function(p){options.extraParams=p};this.findValue=function(){var q=$input.val();if(!options.matchCase)q=q.toLowerCase();var data=options.cacheLength?loadFromCache(q):null;if(data){findValueCallback(q,data)}else if((typeof options.url=="string")&&(options.url.length>0)){jQuery.get(makeUrl(q),function(data){data=parseData(data);addToCache(q,data);findValueCallback(q,data)})}else{findValueCallback(q,null)}};function findValueCallback(q,data){if(data)$input.removeClass(options.loadingClass);var num=(data)?data.length:0;var li=null;for(var i=0;i<num;i++){var row=data[i];if(row[0].toLowerCase()==q.toLowerCase()){li=document.createElement("li");if(options.formatItem){li.innerHTML=options.formatItem(row,i,num);li.selectValue=row[0]}else{li.innerHTML=row[0];li.selectValue=row[0]}var extra=null;if(row.length>1){extra=[];for(var j=1;j<row.length;j++){extra[extra.length]=row[j]}}li.extra=extra}}if(options.onFindValue)setTimeout(function(){options.onFindValue(li)},1)}function addToCache(q,data){if(!data||!q||!options.cacheLength)return;if(!cache.length||cache.length>options.cacheLength){flushCache();cache.length++}else if(!cache[q]){cache.length++}cache.data[q]=data};function findPos(obj){var curleft=obj.offsetLeft||0;var curtop=obj.offsetTop||0;while((obj=obj.offsetParent)){curleft+=obj.offsetLeft;curtop+=obj.offsetTop}return{x:curleft,y:curtop}}};jQuery.fn.autocomplete=function(url,options,data){options=options||{};options.url=url;options.data=((typeof data=="object")&&(data.constructor==Array))?data:null;options.inputClass=(typeof(options.inputClass)=='undefined'||options.inputClass===null)?"ac_input":options.inputClass;options.resultsClass=(typeof(options.resultsClass)=='undefined'||options.resultsClass===null)?"ac_results":options.resultsClass;options.lineSeparator=(typeof(options.lineSeparator)=='undefined'||options.lineSeparator===null)?"\n":options.lineSeparator;options.cellSeparator=(typeof(options.cellSeparator)=='undefined'||options.cellSeparator===null)?"|":options.cellSeparator;options.minChars=(typeof(options.minChars)=='undefined'||options.minChars===null)?1:options.minChars;options.delay=(typeof(options.delay)=='undefined'||options.delay===null)?400:options.delay;options.matchCase=(typeof(options.matchCase)=='undefined'||options.matchCase===null)?0:options.matchCase;options.matchSubset=(typeof(options.matchSubset)=='undefined'||options.matchSubset===null)?1:options.matchSubset;options.matchContains=(typeof(options.matchContains)=='undefined'||options.matchContains===null)?0:options.matchContains;options.cacheLength=(typeof(options.cacheLength)=='undefined'||options.cacheLength===null)?1:options.cacheLength;options.mustMatch=(typeof(options.mustMatch)=='undefined'||options.mustMatch===null)?0:options.mustMatch;options.extraParams=(typeof(options.extraParams)=='undefined'||options.extraParams===null)?{}:options.extraParams;options.loadingClass=(typeof(options.loadingClass)=='undefined'||options.loadingClass===null)?"ac_loading":options.loadingClass;options.selectFirst=(typeof(options.selectFirst)=='undefined'||options.selectFirst===null)?false:options.selectFirst;options.selectOnly=(typeof(options.selectOnly)=='undefined'||options.selectOnly===null)?false:options.selectOnly;options.maxItemsToShow=(typeof(options.maxItemsToShow)=='undefined'||options.maxItemsToShow===null)?-1:options.maxItemsToShow;options.autoFill=(typeof(options.autoFill)=='undefined'||options.autoFill===null)?false:options.autoFill;options.width=parseInt(options.width,10)||0;this.each(function(){var input=this;new jQuery.autocomplete(input,options)});return this};jQuery.fn.autocompleteArray=function(data,options){return this.autocomplete(null,options,data)};jQuery.fn.indexOf=function(e){for(var i=0;i<this.length;i++){if(this[i]==e)return i}return-1};
