import urllib2
from lxml import etree
from lxml.html.clean import clean_html
from lxml.html.soupparser import fromstring
from urlparse import urljoin
from bottle import route, run, debug, static_file, request

results = []
passed = []

@route("/")
def index():
    return static_file("form.html", root="");
    
@route('/crawl.html', method="POST")
def crawl():
	url = request.POST.get("url", "").strip()
	depth = int(request.POST.get("depth", "").strip())
	term = request.POST.get("term", "").strip()
	
	result = crawler(url, depth, term)
	
	#return the results in a templated form
	#print results
	
	resultString = "".join(results)
	
	output = "<table><tr><th>URL searched</th><th>Depth</th></tr> %s </table>" %(resultString)
	print output
	
	
	return output
	
def crawler(url, depth, term):
	
	if depth < 0:
		return
	
	try:	
		page = urllib2.urlopen(url) 
	except:
		print "Error at url: %s;\n" %(url)
		return	
	
	data = page.read()
		
	if term in data: 
		print "found %s in %s\n" %(term,url)
		returnString = "<tr><td>%s</td><td>%s</td></tr>" %(url,depth)
		results.append(returnString)
		
	data = clean_html(data)
	
	root = fromstring(data)
	
	links = root.xpath('.//a/@href')
	
	passed.append(url)
	
	for link in links:
		next = urljoin(url,link)
		
		if next not in passed:
			crawler(next, depth-1, term)
			
			 

debug(True)
run(host='localhost', port=8081)
