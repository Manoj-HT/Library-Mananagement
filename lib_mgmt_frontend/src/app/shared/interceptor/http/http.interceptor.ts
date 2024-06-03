import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  let cleanUrl = req.url == "/login" || req.url =="/config.json"
  if(cleanUrl){
    return next(req);
  }
  let token = localStorage.getItem("token") as string;
  req = req.clone({
    setHeaders : {
      "Authorization" : `Bearer ${token}`
    }
  })
  return next(req)
};
