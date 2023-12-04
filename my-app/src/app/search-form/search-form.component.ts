import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent {


  keyword: string = '';
  zipCode: string = '';
  zip: string = '';
  fromSelection: string = 'currentLocation';
  formSubmitted: boolean = false;
  selectedCategory: string = 'all';
  condition: any = {};
  shipping_options: any = {};
  loading: boolean | undefined;
  filteredOptions: any;
  selectedConditions: string[] = [];
  selectedShippingOptions: string[] = [];
  ebayData: any;
  isebayDataPresent: boolean = false;
  isSearchButtonClicked: boolean = false;
  wishlist: any[] = [];
  titleHovered: boolean = false;
  selectedItem: any = null;
  activeTab: string = 'product';
  shippingInfo: any = null;
  sellerInfo: any = null;
  similarItems: any = null;
  currentTab: string = 'results';
  load: boolean = false;
  wishList: any[] = [];
  detailsEnabled: boolean = false;
  itemSelected: string = '';
  id: string = '';
  displayAll = false;
  dummyData: any[] = [];
  mongoItems: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  totalCost: number = 0;

  shippingCost: string = '0.00';
  shippingLocation: string = 'N/A';
  HandlingTime: string = 'N/A';
  ExpiditedShipping: boolean = false;
  OneDayShippingAvailable: boolean = false;
  ReturnsAccepted: boolean = false;

  sellerName: string = 'N/A';
  feedbackScore: number = 0;
  popularity: number = 0;
  FeedbackRatingStar: string = 'None';
  topRated: boolean = false;
  StoreName: string = 'N/A';
  ButProductAt: string = 'N/A';

  iswhish : boolean = false;
  loadSelectedWish: any;
  flag_result: boolean = false;
  flag_selected_item: boolean = true;
  flag_wishlist: boolean = true;

  selectedSortCategory: string = 'default';
  selectedSortOrder: string = 'asc'; 
  showAll: boolean = false;
  forceTrue: boolean = false;
  photos: any[] = [];
  firstimage: string = '';
  images: string[] = [];
  restimages: string[] = [];
  isebaydataRequeted: boolean = false;
  distance: number = 10;
  photoString: string = '';

  private apiUrl = 'http://localhost:3000/wishlist';

  constructor(private service: AppService,private http: HttpClient) { }

  
  ngOnInit() {
    this.service.getWishlistIds().subscribe((ids: any[]) => {
      this.wishList = ids;
    });
  }

  get isSearchButtonDisabled(): boolean {
    if (this.keyword.length === 0) {
      return true;
    }
    
    if (this.fromSelection !== 'currentLocation') {
      const zipCodeRegex = /^\d{5}$/;
      if (!zipCodeRegex.test(this.zipCode)) {
        return true;
      }
    }

    return false;
  }

  onInputChange(){
    let k = document.getElementById('typeKeyword') as HTMLInputElement;
    if(k.value.length >= 2){
      this.loading=true;
      this.service.getAutoComplete(k.value).subscribe((data:any) => {
        this.filteredOptions = [];  
        this.loading=false;
        for(let i of data.postalCodes){
          this.filteredOptions.push(i.postalCode);
        }
      })
    }
  }

  onSubmit(form: any) {

    this.load = true;
    const processForm = () => {
      this.selectedConditions = [];
      for (let cond in this.condition) {
        if (this.condition[cond]) {
          this.selectedConditions.push(cond);
        }
      }
  
      this.selectedShippingOptions = [];
      for (let ship in this.shipping_options) {
        if (this.shipping_options[ship]) {
          this.selectedShippingOptions.push(ship);
        }
      }
  
      this.printFormValues(form);
    }
  
    if(this.fromSelection === 'currentLocation') {
      this.service.getIP().subscribe((data:any) => {
        this.zip = data.postal; 
        processForm(); 
      });
    } else {
      this.zip = form.value.zipCode;
      processForm();
    }
  }

  printFormValues(form: any) {
    this.formSubmitted = true;
    this.service.getEbayData(this.keyword, this.selectedCategory, this.selectedConditions, this.selectedShippingOptions, this.distance.toString(), this.zip).subscribe((data:any) => {
      
      this.ebayData = data.findItemsAdvancedResponse[0].searchResult[0].item;
      this.isSearchButtonClicked = true;
      this.flag_result = true;
      this.isebaydataRequeted = true;
      if(this.ebayData){
        this.isebayDataPresent = true;
        this.totalPages = Math.ceil(this.ebayData.length / this.itemsPerPage);
        this.load = false;
      }
      else{
        this.isebayDataPresent = false;
        this.load = false;
      }
     
    }
    );
    
  }
  toggleTab(tabName: string) {
    this.currentTab = tabName;

    if(tabName === 'results'){
      this.iswhish = false;
      this.flag_result = true;
      this.flag_selected_item = false;
    }
    
    else if(tabName === 'wishlist'){
      this.updateWishList();
      this.iswhish = true;
      this.flag_selected_item = false;
      this.flag_wishlist = true;
    }

    else{
      this.iswhish = false;
    }

  }

  updateWishList() {
    this.service.getWishlist().subscribe(data => {
      this.mongoItems = data;
      this.totalCost = 0;

      this.mongoItems.forEach(item => {
        this.totalCost += parseFloat(item.itemPrice); 
        this.totalCost = Number(this.totalCost.toFixed(3)); // Where `totalCost` is a property of your component

      });
    });

  }


  onClear(form: any) {
    this.keyword = '';
    this.zipCode = '';
    this.formSubmitted = false;
    this.selectedCategory = 'all'; 
    this.fromSelection = 'currentLocation';  
    this.condition = {};
    this.shipping_options = {};
    this.filteredOptions = [];
    this.selectedConditions = [];
    this.selectedShippingOptions = [];
    this.ebayData = null;
    this.isSearchButtonClicked = false;
    this.isebayDataPresent = false;
    this.wishlist = [];
    this.titleHovered = false;
    this.selectedItem = null;
    this.activeTab = 'product';
    this.shippingInfo = null;
    this.sellerInfo = null;
    this.similarItems = null;
    this.currentTab = 'results';
    this.isebaydataRequeted = false;
    this.distance = 10;
    this.flag_result = false;
    this.flag_selected_item = true;
    this.flag_wishlist = true;
    this.id = '';
    this.detailsEnabled = false;
}


addToWishlist(item: any){
 
  if(item.itemId[0] === undefined)
  {
    this.wishList.push(item.itemId);
  }
  else{
    this.wishList.push(item.itemId[0]);
  }
  this.service.pushToWishlist(item).subscribe((data:any) => {
  }
  );
}

removeFromWishlist(item: string) {
  const index = this.wishList.findIndex(w => w === item); 
  if (index !== -1) {
      this.wishList.splice(index, 1);
  }
  this.service.removeFromWishlist(item).subscribe((data:any) => {
    this.updateWishList();
  }
  );
}

isInWishlist(item: any): boolean {
  return this.wishList.some(w => w === item);
}



  getTitleDisplay(title: string): string {
    const maxLength = 40;
    if (title.length <= maxLength) {
        return title;
    }

    let cutString = title.slice(0, maxLength);
    let lastWhitespaceIndex = cutString.lastIndexOf(' ');
    
    if (lastWhitespaceIndex !== -1) {
        cutString = cutString.slice(0, lastWhitespaceIndex);
    }
    
    return `${cutString}…`;
}
navigateToProductDetails(): void {
  this.onTitleClick(this.itemSelected)
}
onTitleClick(data: any): void {
 
  this.loadSelectedWish = data;
  if (data?.title !== undefined) {
    this.photoString = data.title[0];
    this.id = data.itemId?.[0] ?? 'N/A';

    this.shippingCost = data.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ ?? 'N/A';
    this.shippingLocation = data.shippingInfo?.[0]?.shipToLocations?.[0] ?? 'N/A';
    this.HandlingTime = data.shippingInfo?.[0]?.handlingTime?.[0] ?? 'N/A';
    this.ExpiditedShipping = data.shippingInfo?.[0]?.expeditedShipping?.[0] ?? 'N/A';
    this.OneDayShippingAvailable = data.shippingInfo?.[0]?.oneDayShippingAvailable?.[0] ?? 'N/A';
    this.ReturnsAccepted = data.returnsAccepted?.[0] ?? 'N/A';

    this.sellerName = data.sellerInfo?.[0]?.sellerUserName?.[0] ?? 'N/A';
    this.feedbackScore = parseFloat(data.sellerInfo?.[0]?.feedbackScore?.[0]) ?? 'N/A';
    this.popularity = parseFloat(data.sellerInfo?.[0]?.positiveFeedbackPercent?.[0]) ?? 'N/A';
    this.FeedbackRatingStar = data.sellerInfo?.[0]?.feedbackRatingStar?.[0] ?? 'N/A';
    this.topRated = data.sellerInfo?.[0]?.topRatedSeller?.[0] ?? 'N/A';
    this.StoreName = data.storeInfo?.[0]?.storeName?.[0] ?? 'N/A';
    this.ButProductAt = data.storeInfo?.[0]?.storeURL?.[0] ?? 'N/A';
    this.itemSelected = data ?? 'N/A';
}


  else{
    this.photoString = data.itemTitle;
    this.id = data.itemId;
    this.shippingCost = data.shippingCost;
    this.shippingLocation = data.shippingLocation;
    this.HandlingTime = data.HandlingTime;
    this.ExpiditedShipping = data.ExpiditedShipping;
    this.OneDayShippingAvailable = data.OneDayShippingAvailable;
    this.ReturnsAccepted = data.ReturnsAccepted;
    this.sellerName = data.sellerName;
    this.feedbackScore =parseFloat(data.feedbackScore);
    this.popularity = parseFloat(data.popularity);
    this.FeedbackRatingStar = data.FeedbackRatingStar;
    this.topRated = data.topRated;
    this.StoreName = data.StoreName;
    this.ButProductAt = data.ButProductAt;
    this.itemSelected = data;
  }
  this.detailsEnabled = true;
  
  this.service.getEbayDetails(this.id).subscribe((data:any) => {
    this.isSearchButtonClicked = false;
    this.flag_result = false;
    this.selectedItem = data;
    this.images = this.selectedItem.Item.PictureURL;
      const index = this.images.indexOf(this.images[0]);
      this.firstimage = this.images[0];
      if (index > -1) {
        this.images.splice(index, 1);
      }
      this.restimages = this.images;
    this.flag_selected_item = true;
    this.flag_wishlist = false;


  }
  );

  this.service.getPhotos(this.photoString).subscribe((data:any) => {
    this.photos = data.items;
  }
  );

  this.service.getEbaySimilarItems(this.id).subscribe((data:any) => {
    this.similarItems = data.getSimilarItemsResponse.itemRecommendations.item;
  } 
  );

}
backToList(): void {
  this.selectedItem = null;
  this.isSearchButtonClicked = true;
  this.flag_result = true;
  this.flag_wishlist = true;
}

changeTab(tabName: string) {
  this.activeTab = tabName;
}

get displayedData() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.ebayData.slice(start, end);
}
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

setPage(page: number) {
  this.currentPage = page;
}

getStarColor(feedbackRatingStar: string): string {
  const colors = {
    None: '#000',
    Yellow: 'yellow',
    Blue: 'blue',
    Turquoise: 'turquoise',
    Purple: 'purple',
    Red: 'red',
    Green: 'green',
    YellowShooting: 'yellow',
    TurquoiseShooting: 'turquoise',
    PurpleShooting: 'purple',
    RedShooting: 'red',
    GreenShooting: 'green',
    SilverShooting: 'silver',
  };
  return colors[feedbackRatingStar as keyof typeof colors] || colors['None']; 
}


sortItems(): void {
  if (this.selectedSortCategory !== 'default') {
      this.similarItems.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
          let aValue, bValue;
          
          if (this.selectedSortCategory === 'timeLeft') {
              aValue = parseInt(a['timeLeft'].split('P')[1].split('D')[0], 10);
              bValue = parseInt(b['timeLeft'].split('P')[1].split('D')[0], 10);
          } else if (typeof a[this.selectedSortCategory].__value__ !== 'undefined') {
              aValue = a[this.selectedSortCategory].__value__;
              bValue = b[this.selectedSortCategory].__value__;
          } else {
              aValue = a[this.selectedSortCategory];
              bValue = b[this.selectedSortCategory];
          }

          let comparison = 0;

          if (typeof aValue === 'number' && typeof bValue === 'number') {
              comparison = aValue - bValue;
          } else if (typeof aValue === 'string' && typeof bValue === 'string') {
              comparison = aValue.localeCompare(bValue);
          }

          return (this.selectedSortOrder === 'desc') ? (comparison * -1) : comparison;
      });
  }
}

toggleDisplayAll(): void {
  this.displayAll = !this.displayAll;
}

}
