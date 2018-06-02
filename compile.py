# -*- coding: UTF-8 -*-
import os, sys
import re
import time

index_pathname = "public/pages/WWW/index" #网站首页所在的目录
index_filename = "index.bhtml" #网站首页文件名
target_filename = "index.html" #编译后的网站首页文件名

os.chdir(index_pathname) #改变python的工作目录

def compile():

    index_file = open(index_filename, 'r') #打开首页html
    index_content = index_file.read() #获取html内容
    index_file.close()

    include_list = re.findall(r'<include.*?>.*?</include>', index_content) #匹配出<include>标签
    for include in include_list: #遍历列表取出src，进行html的编译
        src = re.search('<include src="(.*?)"', include).group(1)
        src_file = open(src, 'r') #打开路径对应的文件
        src_content = src_file.read()
        tpl = re.search('<template.*?>.*?</template>', src_content, re.S) #获取出模板内容
        if tpl: #如果匹配到了内容，则替换进首页的<include>中
            index_content = re.sub(include, tpl.group(), index_content)
        else:
            print 'none'
        src_file.close()

    target_file = open(target_filename, 'w') #新建一个文件，用于保存编译后的html
    target_file.write(index_content)
    target_file.close()

print 'running'

while True:
    compile()
    time.sleep(0.1)
os.system("pause")
