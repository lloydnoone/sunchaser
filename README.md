![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

<<<<<<< HEAD
# priorities
if no clear skies found, find warmest city


start map view at current position
form overlap issue
borders on mobile loading screen
mobile responsive
regex auth on forms
regex anims
try importing intead of url

start and end tags

ask about .then in form toggle


=======
![image](https://github.com/lloydnoone/sunchaser/blob/master/Screenshot%202019-12-17%20at%2012.28.39.png?raw=true)

This was the final project assigned to me by General Assembly during a software engineering immersive course. The purpose of the project was to apply the basic usage of python with the django framework on the backend of a full stack app.

The app calculates a route using public transport to the closest city in the uk that has clear skies. Users can then express interest in taking the journey and see other users who have done so and communicate.

![image](https://github.com/lloydnoone/sunchaser/blob/master/Screenshot%202019-12-17%20at%2012.27.47.png?raw=true)

## Built With

1. HTML5
2. CSS3
3. JavaScript
4. React
5. Python
6. Django rest framework
4. GitHub

## Deployment

The app is deployed on Heroku and it can be found here- http://sun-chaser.herokuapp.com/

## Getting Started

When the app loads it will automatically calculate a route using public transport to the closest city in the uk with clear skies. Once loaded, you can then register or login to express interest in the route, comment on it and see other users and their comments.

![image](https://github.com/lloydnoone/sunchaser/blob/master/Screenshot%202019-12-17%20at%2012.28.53.png?raw=true)

## How It Works

The app uses 3 APIs, openweather, geocoder, and transportation API. When the page is loaded, the users latitude and longtitude is found using geocoder. A call to openweather API finds the weather conditions for 17 major cities around the UK. Moslty on the coast. Those cities are then filtered down to cities with clear skies. The distance of the cities is calculated by finding the total difference in latitude and longtitude in each and then finding the city that is the least distance away.

The users location and the location of that city is then used in a call to transportation API which is then calculates the route using public transport between the two. This route is then displayed on the map. That route, if it doesnt already exist in the database from a previous search is saved to the database along with interested users and their comments that are attached to it.

![image](https://github.com/lloydnoone/sunchaser/blob/master/Screenshot%202019-12-17%20at%2012.29.14.png?raw=true)

Below is the code that handles the main logic of getting the data, filtering it and returning it to the front end.

```javascript
class ClosestSun(APIView):

    def get(self, _request):

        ###############get closest sun################
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
        OWKey = os.getenv('OWKEY')
        weather_response = requests.get(f'http://api.openweathermap.org/data/2.5/group?id={joinedCodes}&units=metric&appid={OWKey}')
        weather_data = weather_response.json()
        clearskies = [city for city in weather_data['list'] if city['weather'][0]['description'] == 'clear skies']
        distance = 100
        closest_idx = None
        for idx, city in enumerate(clearskies):
            lat_diff = abs(user_lat - city['coord']['lat'])#find dist in lat
            long_diff = abs(user_long - city['coord']['lon'])#find dist in long
            total_diff = lat_diff + long_diff #find total dist
             #if lower than previous recorded distance record new
            if total_diff <= distance:
                distance = total_diff
                closest_idx = idx

        #############Calculate the route#################

        from_crd = f"lonlat:{user_long},{user_lat}"
        to_crd = f"lonlat:{clearskies[closest_idx]['coord']['lon']},{clearskies[closest_idx]['coord']['lat']}"

        TPKey = os.getenv('TPKEY')
        TPId = os.getenv('TPID')
        route_response = requests.get(f'https://transportapi.com/v3/uk/public/journey/from/{from_crd}/to/{to_crd}.json?app_id={TPId}&app_key={TPKey}&service=southeast')
        route_data = route_response.json()
        return Response(route_data)
```

## Wins and Blockers

The main challenge in this project was to get to grips with python and django in a short space of time before making the app. It was a lot to take in at once and really tested my ability to quickly pick up a new technology and get to grips with the documentation.

The part where i spent the most time and had the most difficulty working with the serializers and models for the database. Throughout the course i constantly felt like databases were a weakness of mine. I was happy to have the opportunitiy to once again make a full stack app on my own in order to get more comfortable with it. By the end of this project i was a lot more confident with creating models and backend in general. 

A big win for me then was to increase my confidence in databases and backend.

![image](https://github.com/lloydnoone/sunchaser/blob/master/Screenshot%202019-12-17%20at%2012.30.52.png?raw=true)

## Future Features

I would have liked to add more options for the user in generating the journey. For example taking temperature into account or calculate a route to drive rather than take public transport. The time constraints forced me to cut back on these features. On the front end, validation needs improving and some bug fixing is needed.

## Key Learnings

As mentioned earlier, the main learning experience for me was getting more comfortable with databases and backend. Other than that i realised that picking up another language and framework is not as big of a problem as i thought. Most of the concepts from javascript applied to python and the same for backend in general so the project was not as difficult as i was anticipating.

## Author 

Lloyd Noone - portfolio: lloydnoone.com
>>>>>>> 23bc5fdf71994d35ceef28c97838b989e2bad223
