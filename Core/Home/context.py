def gg(request):
    refresh_token = request.session.get('refresh', None)
    if refresh_token:
        return {'refresh': request.session['refresh']}
    return {'name':"sanjeeb"}
        