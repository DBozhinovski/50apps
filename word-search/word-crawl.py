import urllib2
import re
import simplejson
from BeautifulSoup import BeautifulSoup
from bottle import route, run, debug, static_file, request
from collections import Counter, defaultdict


ignored = ['a', 'an', 'the', 'on', 'in', 'for', 'and','to','it','of']

@route("/")
def index():
	return static_file("form.html", root="")
	
@route("/results.html", method="POST")
def results():
	url = request.POST.get("url", "").strip()
	
	try:	
		page = urllib2.urlopen(url) 
	except:
		print "Error at url: %s;\n" %(url)
		return
		
	data = BeautifulSoup(page.read())
	
	tags = data.findAll(text=True)
	
	words = []
	
	for i in range(len(tags)):
		words.extend(re.split("\W+", tags[i]))
		
	words = filter(bool, words)
	
	words = [x.lower() for x in words]
	
	# count the frequency of occurrence of each word in list with that count
	frequency = Counter(words)

	# invert the frequency dictionary so keys are
	# frequency of occurrence and values are the words
	frequentWords = defaultdict(list)
	for word, occurence in frequency.items():
		frequentWords[occurence].append(word)

	# print in order of occurrence
	occurences = frequentWords.keys()
	occurences.sort(reverse=True)
	
	#print simplejson.dump(occurences)
	
	results = '{"data": ['
	
	for freq in occurences:
		frequentWords[freq].sort() # sort words in list
		#print 'count {}: {}'.format(freq, frequentWords[freq])
		words = ",".join(frequentWords[freq])
		results = results + '{"repetitions":"%s", "words":%s}'%(freq, frequentWords[freq]) + ","
	
	results = results[:-1] + "]}"
	
	
	print results
	
	return results
	

	
	
	
debug(True)
run(host='localhost', port=8282)
