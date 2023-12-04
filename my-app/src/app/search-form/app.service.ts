
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' 
})

export class AppService {

  constructor(private http: HttpClient) { }

  getIP(): Observable<any> {
    let url = "https://ipinfo.io?token=11e7582279af4a";
    
    return this.http.get<any>(url).pipe(
      map(data => data),
      catchError(error => {
        return [];
      })
    );
  }

  getAutoComplete(Keyword:string): Observable<any>{
    // const url = 'http://localhost:3000/getautocomplete';
    const url = 'https://assignment3backend.uc.r.appspot.com/getautocomplete';

    let params = {
      Keyword: Keyword
    };
    let queryParams = new HttpParams({fromObject: params});
    return this.http.get<any>(url, {params: queryParams})
    .pipe(
      map((data:any) => {
        //////console.log(data);
        return data;
      }),
      catchError((error:any) => {
        // //////console.log(error);
        return error;
      })
    )
  }

  getEbayData(keyword: string, category: string, condition: string[], shipping: string[], distance: string, zipCode: string): Observable<any> {
    // const url = 'http://localhost:3000/getebaydata';
    const url = 'https://assignment3backend.uc.r.appspot.com/getebaydata'
    let params = {
      keyword,
      category,
      condition,
      shipping,
      distance,
      zipCode
    };
    //////console.log(params);
    let queryParams = new HttpParams({ fromObject: params });

    return this.http.get<any>(url, { params: queryParams })
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error: any) => {
          return error;
        })
      );
  }

  getEbayDetails(itemId: string): Observable<any> {
    // const url = 'http://localhost:3000/singledata';
    const url = 'https://assignment3backend.uc.r.appspot.com/singledata'
    let params = {
      itemId
    };
    let queryParams = new HttpParams({ fromObject: params });

    return this.http.get<any>(url, { params: queryParams })
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error: any) => {
          return error;
        })
      );
  }

  getPhotos(keyword: string): Observable<any> {
    // const url = 'http://localhost:3000/getphotos';
    const url = 'https://assignment3backend.uc.r.appspot.com/getphotos'
    let params = {
      keyword
    };
    let queryParams = new HttpParams({ fromObject: params });

    return this.http.get<any>(url, { params: queryParams })
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error: any) => {
          return error;
        })
      );
  }

  getEbaySimilarItems(itemId: string): Observable<any> {
    // const url = 'http://localhost:3000/similardata';
    const url = 'https://assignment3backend.uc.r.appspot.com/similardata';
    let params = {
      itemId
    };
    let queryParams = new HttpParams({ fromObject: params });

    return this.http.get<any>(url, { params: queryParams })
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error: any) => {
          return error;
        })
      );
  }

  pushToWishlist(item: any): Observable<any> {
    // const url = 'http://localhost:3000/wishlist';
    const url = 'https://assignment3backend.uc.r.appspot.com/wishlist';
    const itemData = { 
      
      itemId: item?.itemId?? 'N/A', 
      itemImage: item?.galleryURL ?? 'N/A', 
      itemTitle: item?.title?.[0] ?? 'N/A', 
      itemPrice: item?.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ ?? 'N/A', 
      itemShipping:item?.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ ?? 'N/A',
      shippingCost: item?.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ ?? 'N/A',
      shippingLocation: item?.shippingInfo?.[0]?.shipToLocations?.[0]?? 'N/A',
      HandlingTime: item?.shippingInfo?.[0]?.handlingTime?.[0]?? 'N/A',
      ExpiditedShipping: item?.shippingInfo?.[0]?.expeditedShipping?.[0]?? 'N/A',
      OneDayShippingAvailable: item?.shippingInfo?.[0]?.oneDayShippingAvailable?.[0]?? 'N/A',
      ReturnsAccepted: item?.returnsAccepted?.[0]?? 'N/A',
      sellerName: item?.sellerInfo?.[0]?.sellerUserName?.[0]?? 'N/A',
      feedbackScore: item?.sellerInfo?.[0]?.feedbackScore?.[0]?? 'N/A',
      popularity: item?.sellerInfo?.[0]?.positiveFeedbackPercent?.[0]?? 'N/A',
      FeedbackRatingStar: item?.sellerInfo?.[0]?.feedbackRatingStar?.[0]?? 'N/A',
      topRated: item?.sellerInfo?.[0]?.topRatedSeller?.[0]?? 'N/A',
      storeName: item?.storeInfo?.[0]?.storeName?.[0]?? 'N/A',
      BuyProductAt: item?.storeInfo?.[0]?.storeURL?.[0]?? 'N/A',
    };
    return this.http.post<any>(url,  itemData );
  }

  removeFromWishlist(itemId: string): Observable<any> {
    // const url = `http://localhost:3000/wishlist/${itemId}`; 
    const url = `https://assignment3backend.uc.r.appspot.com/wishlist/${itemId}`;
    return this.http.delete<any>(url);
  }

  getWishlistIds(): Observable<string[]> {
    // const url = 'http://localhost:3000/wishlist/ids';
    const url = 'https://assignment3backend.uc.r.appspot.com/wishlist/ids';
    return this.http.get<string[]>(url);
  }

  getWishlist(): Observable<any[]> {
    // const url = 'http://localhost:3000/wishlist';
    const url = 'https://assignment3backend.uc.r.appspot.com/wishlist';
    return this.http.get<any[]>(url);
  }

}
