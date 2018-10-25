import bs4 as bs
import urllib.request
import csv


with open('/Users/gabriellelamarrlemee/Desktop/NORTHEASTERN/SUMMER2017/Schools_Cont/schools.csv','r') as Results:
    Results_Reader = csv.reader(Results)
    Results_List = []
    for row in Results_Reader:
        if len (row) != 0:
            Results_List = Results_List + [row]

print(Results_List)
Results.close()

with open('/Users/gabriellelamarrlemee/Desktop/NORTHEASTERN/SUMMER2017/Schools_Cont/schoolsData.csv','w') as Schools_Write:

    for row in Results_List:
        url = row[2].replace("\ufeff", "")
        print(url)
        sauce = urllib.request.urlopen(url).read()
        soup = bs.BeautifulSoup(sauce,'lxml')
        Schools_Writer = csv.writer(Schools_Write)

        for a in soup.find_all('div', class_='school-contact__district-name'):
            districtName = a.text
            print(districtName)

        scores = ''
        for div in soup.find_all('div', class_='test-score-container'):
            print(div)
            scores = scores + div.text.replace('\n',',').replace('          ',' ').replace('State avg:','StateAvg').replace('Grade ','Grade')
        scores1 = scores.replace(',,,,',' ')
        scores2 = scores1.replace(',','').replace('                 ',' ').replace('          ',' ').replace('      ',' ').replace('   ',' ').replace('   ',' ').replace('  ',' ')
        scores3 = scores2.replace('Percent of teachers with less than 3 years of experience','%Under_3_Yrs_Exp').replace('% of full time teachers who are certified','%FullTime_Certified_Teachers')
        scores4 = scores3.replace(' ',',')
        print(scores4)

        for div in soup.find('div', id_='SchoolProfileComponent-react-component-1c36ded1-6000-4aa4-8d5a-a3f34d64d8bc'):
            equity = div
            print(equity)

            for div in equity.find_all('div', class_='test-score-container'):
                print(div)

        Schools_Writer.writerow(row + [districtLink] + [districtName] + [address])
        print(row + [districtLink] + [districtName] + [info])


Schools_Write.close()

