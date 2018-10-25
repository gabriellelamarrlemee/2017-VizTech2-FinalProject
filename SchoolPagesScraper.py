import bs4 as bs
import urllib3
import csv

with open('/Users/gabriellelamarrlemee/Desktop/NORTHEASTERN/SUMMER2017/Schools_Cont/NIU_School_Data.csv','r') as Results:
    Results_Reader = csv.reader(Results)
    Results_List = []
    for row in Results_Reader:
        if len (row) != 0:
            Results_List = Results_List + [row]

print(Results_List)
Results.close()

with open('/Users/gabriellelamarrlemee/Desktop/NORTHEASTERN/SUMMER2017/Schools_Cont/schoolsData.csv','w') as Schools_Write:
    http = urllib3.PoolManager()
    urllib3.disable_warnings()

    for row in Results_List:
        url = row[0]
        name = row[1]
        print(url)
        response = http.request('GET', url)
        soup = bs.BeautifulSoup(response.data, 'lxml')

        for button in soup.find_all('button', name_='downloadexcel'):
            data = button.read()

            filename = name + ".xls"
            file_ = open(filename, 'w')
            file_.write(data)
            file_.close()


Schools_Write.close()
