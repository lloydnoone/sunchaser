# pylint: disable=no-member
#import math
import os
from dotenv import load_dotenv

import requests
import geocoder

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
#from rest_framework.exceptions import PermissionDenied
from rest_framework.status import HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED
from .models import Journey, Comment
from .serializers import JourneySerializer, PopulatedJourneySerializer, CommentSerializer
load_dotenv()
class JourneyListView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, _request):
        journeys = Journey.objects.all()
        serialized_journeys = PopulatedJourneySerializer(journeys, many=True)
        return Response(serialized_journeys.data)

    def post(self, request):
        # request.data['owner'] = request.user.id
        journey = JourneySerializer(data=request.data)
        if journey.is_valid():
            journey.save()
            return Response(journey.data, status=HTTP_201_CREATED)
        return Response(journey.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

class JourneyDetailView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, _request, pk):
        journey = Journey.objects.get(pk=pk)
        serialized_journey = PopulatedJourneySerializer(journey)
        return Response(serialized_journey.data)

    def put(self, request, pk):
        #request.data['owner'] = request.user.id  -- no longer need this i think
        journey = Journey.objects.get(pk=pk)
        updated_journey = JourneySerializer(journey, data=request.data)
        if updated_journey.is_valid():
            updated_journey.save()
            return Response(updated_journey.data)
        return Response(updated_journey.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

    def delete(self, _request, pk):
        journey = Journey.objects.get(pk=pk)
        journey.delete()
        return Response(status=HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        #request.data
        journey = Journey.objects.get(pk=pk) #get journey by pk
        original_journey = JourneySerializer(journey) #serialize the new data together with the old
        original_journey.data['users'].append(request.user.id) #({ 'id' : request.user.id, 'username' : request.user.username }) #add current user into array
        updated_journey = JourneySerializer(journey, data=original_journey.data) #serialize old with new data
        if updated_journey.is_valid():#check it
            updated_journey.save()#save to db
            updated_journey = PopulatedJourneySerializer(updated_journey.instance) #pass an instance to circumvent is_valid
            return Response(updated_journey.data)
        return Response(updated_journey.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

class JourneySearchView(APIView): #view to get journey by start and end

    permission_classes = (IsAuthenticated, )
    def get(self, _request, start, end):
        print('start', start)
        print('end', end)
        journey = Journey.objects.get(end__iexact=end)
            # print('journey: ------------------->', journey)
            #journey = Journey.objects.get(start=start, end=end)
    #     except Journey.DoesNotExist:
    #         print('error should be raised!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    #         raise PermissionDenied({'message': 'That Journey could not be found in search view. '})
    #    # if not journey:
    #         #raise PermissionDenied({'message': 'That Journey could not be found in search view. '})
        serialized_journey = PopulatedJourneySerializer(journey)

        return Response(serialized_journey.data)#serialized_journey.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class CommentListView(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        request.data['owner'] = request.user.id
        request.data['journey'] = pk
        comment = CommentSerializer(data=request.data)
        if comment.is_valid():
            comment.save()
            journey = Journey.objects.get(pk=pk)
            serialized_journey = PopulatedJourneySerializer(journey)
            return Response(serialized_journey.data)
        return Response(comment.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

class CommentDetailView(APIView):

    permission_classes = (IsAuthenticated, )

    def delete(self, request, comment_pk, **kwargs):
        comment = Comment.objects.get(pk=comment_pk) # find the comment by its id
        # keep a reference to the jouney it was on
        journey = Journey.objects.get(pk=comment.journey.id)
        serialized_journey = PopulatedJourneySerializer(journey)

        if comment.owner.id != request.user.id:
            return Response(status=HTTP_401_UNAUTHORIZED)
        comment.delete()
        #return Response(status=HTTP_204_NO_CONTENT)
        return Response(serialized_journey.data)

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
        destination = [city for city in weather_data['list'] if city['weather'][0]['description'] == 'clear sky' or 'scattered clouds']
        # if destination is undefined then filter weather data for highest temp instead
        sun_found = True # boolean to send as part of data to front end
        if len(destination) is 0:
            sun_found = False
            closest_idx = 0 # already found the warmest city
            # filter for highest temp
            destination = sorted(weather_data['list'], key=lambda city: city['main']['temp'], reverse=True)
        else:
            #find closest city
            distance = 100
            closest_idx = None
            for idx, city in enumerate(destination):
                lat_diff = abs(user_lat - city['coord']['lat'])#find dist in lat
                long_diff = abs(user_long - city['coord']['lon'])#find dist in long
                total_diff = lat_diff + long_diff #find total dist
                #if lower than previous recorded distance record new
                if total_diff <= distance:
                    distance = total_diff
                    closest_idx = idx

        #############Calculate the route#################
        from_crd = f"lonlat:{user_long},{user_lat}"
        to_crd = f"lonlat:{destination[closest_idx]['coord']['lon']},{destination[closest_idx]['coord']['lat']}"

        TPKey = 'cbd41eac203131882ea38c624e4ae84d' #os.getenv('TPKEY')
        TPId = '526bec4c'#os.getenv('TPID')
        route_response = requests.get(f'https://transportapi.com/v3/uk/public/journey/from/{from_crd}/to/{to_crd}.json?app_id={TPId}&app_key={TPKey}&service=southeast')
        route_data = route_response.json()
        
        route_data['sun_found'] = sun_found # add the sun found boolean to response
        print('route data after add sun_found------------------->', route_data)
        return Response(route_data)
