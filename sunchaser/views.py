from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import geocoder
import math

class ClosestSun(APIView):

#&appid=68744f08950db8e051f0bc70de642369

    def get(self, _request):

        ###############get closest sun################

        g = geocoder.ip('me')
        user_lat = g.latlng[0]
        user_long = g.latlng[1]
        print('user_lat: ', user_lat)
        print('user_long: ', user_long)

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
        weather_response = requests.get(f'http://api.openweathermap.org/data/2.5/group?id={joinedCodes}&units=metric&appid=68744f08950db8e051f0bc70de642369')
        weather_data = weather_response.json()
        print('weather_data-------------->', weather_data)
        clearskies = [city for city in weather_data['list'] if city['weather'][0]['description'] == 'light rain']
        print('clearskies-------------->', clearskies)
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
        

        #############Calculate the route#################
        ####transport API
        ####App ID: 526bec4c
        ####Key cbd41eac203131882ea38c624e4ae84d

        ####from lonlat:lonlat:-0.1257,51.5085
        ####to lonlat:lonlat:-2.94,54.9

        from_crd = f"lonlat:{user_long},{user_lat}"
        to_crd = f"lonlat:{clearskies[closest_idx]['coord']['lon']},{clearskies[closest_idx]['coord']['lat']}"

        route_response = requests.get(f'https://transportapi.com/v3/uk/public/journey/from/{from_crd}/to/{to_crd}.json?app_id=526bec4c&app_key=cbd41eac203131882ea38c624e4ae84d&service=southeast')
        route_data = route_response.json()

        return Response(route_data)
