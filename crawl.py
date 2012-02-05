#
# 50apps challenge, Python web crawler
#
# by Darko Bozhinovski
#

import sys
import urllib2
from lxml import etree
from lxml.html.clean import clean_html
from lxml.html.soupparser import fromstring
from urlparse import urljoin

passed = []

def crawler(url, depth, term):
	#search url for keyword
	
	if depth < 0:
		return
	
<<<<<<< HEAD
#	try:	
	page = urllib2.urlopen(url) 
	print "Searching through: %s;\n" %(url) 
#	except:
#		print "Error at url: $s;\n" %(url)
		
        #return	
=======
	page = urllib2.urlopen(url) 
	print "Searching through: %s;\n" %(url) 
>>>>>>> 1df6aea50a7418d937249b9e6f12ecc728a2506a
		
	data = page.read()
	
	if term in data: 
		print "found %s in %s\n" %(term,url)
		
	data = clean_html(data)
	
	root = fromstring(data)
	
	links = root.xpath('.//a/@href')
	
	passed.append(url)
	
	for link in links:
		next = urljoin(url,link)
		
		if next not in passed:
			crawler(next, depth-1, term)
			

def run():
	#run the app after getting data from the terminal
		
	if len(sys.argv) != 4:
		print("Insufficient parameters; Requires $url $depth $searchterm")
		exit()	
	
	url = sys.argv[1]
	depth = int(sys.argv[2])
	term = sys.argv[3]
	
	crawler(url, depth, term)
		

run()	
		

