from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import geocoder
import math

class WeatherListView(APIView):

#&appid=68744f08950db8e051f0bc70de642369

    def get(self, _request):
        
        g = geocoder.ip('me')
        user_lat = g.latlng[0]
        user_long = g.latlng[1]

        country_codes = {
            'inverness'   :'2646088',
            'aberdeen'    :'2657832',
            'glasgow'     :'2648579',
            'carlisle'    :'2653775',
            'newcastle'   :'3333174',
            'liverpool'   :'3333167',
            'leeds'       :'3333164',
            'aberystwyth' :'7292321',
            'cardiff'     :'2653822',
            'sheffield'   :'3333193',
            'oxford'      :'7290621',
            'cambridge'   :'7290660',
            'norwich'     :'7290598',
            'canterbury'  :'7290598',
            'brighton'    :'3333133',
            'bournemouth' :'3333129',
            'plymouth'    :'3333181'
        }
        joinedCodes = ','.join(str(x) for x in country_codes.values())
        # response = requests.get('https://api.darksky.net/forecast/f3c493fadeeb15c55b63a9f2412d4428/42.3601,-71.0589')
        #response = requests.get('http://api.openweathermap.org/data/2.5/group?id=2646088,2657832,2653775&units=metric&appid=68744f08950db8e051f0bc70de642369')
        response = requests.get(f'http://api.openweathermap.org/data/2.5/group?id={joinedCodes}&units=metric&appid=68744f08950db8e051f0bc70de642369')
        data = response.json()
        clearskies = [city for city in data['list'] if city['weather'][0]['description'] == 'clear sky']
        distance = 100
        closest_idx = None
        for idx, city in enumerate(clearskies):
            print('previous distance: ', distance)
            lat_diff = abs(user_lat - city['coord']['lat'])#find dist in lat
            long_diff = abs(user_long - city['coord']['lon'])#find dist in long
            total_diff = lat_diff + long_diff #find total dist
            print('City: ', city['name'],'total_diff: ', total_diff)
             #if lower than previous recorded distance record new
            if total_diff <= distance:
                print('diff should be assigned. ')
                distance = total_diff
                closest_idx = idx

        print('completed: ', distance)
        print('closest city: ', clearskies[closest_idx])

        return Response(clearskies[closest_idx])
