#!/usr/bin/env python

# Author: Tom Ingleby <tom@ewsting.org>
# Copyright (c) 2015 Tom Ingleby.
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import opkg
import json

entries_per_json = 500
split_it = lambda A, n=entries_per_json: [A[i:i+n] for i in range(0, len(A), n)]

class Opkg_Package:
    def __init__(self, name,version,section,filename,description,source):
        self.name = name;
        self.version = version;
        self.section = section;
        self.filename = filename;
        self.description = description;
        self.source = source;

opkg_file = opkg.Packages()
opkg_file.read_packages_file('./Packages')

packagelist = []

for i in sorted(opkg_file.packages):
    p = opkg_file.packages[i]
    x = Opkg_Package(p.package,p.version,p.section,p.filename,p.description,p.source)
    packagelist.append(x)

split_list = split_it(packagelist)
chunk_list = []

for index_chunk, chunk in enumerate(split_list):
    chunk_name = 'packages-'+str(index_chunk)+'.json'
    cf = open(chunk_name, 'w')
    json.dump(([vars(a) for a in chunk]), cf)
    cf.close()
    chunk_list.append(chunk_name)

f = open('index.json', 'w')
json.dump(chunk_list, f)
f.close()
