sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, UploadCollectionParameter, JSONModel) {
    "use strict";
    var base64Url;
    var arrayBuffer;
    return Controller.extend("local.HybridProject.controller.main", {

        onInit: function () {
            //Set template for items to be inserted into the select elements
            var oItemSelectTemplate = new sap.ui.core.Item({
                key : "{dkey}",
                text : "{dtext}"
            });
            //Cuisine model
            var mModel_cuisine = new sap.ui.model.json.JSONModel("model/cuisineList.json"); //initialise your model from a JSON file
            sap.ui.getCore().setModel(mModel_cuisine, "cuisine_model"); //set model with a name to use later
            var selectCuisine = this.byId("cuisineList"); //Get a reference to the UI element, Select to bind data
            selectCuisine.setModel(sap.ui.getCore().getModel("cuisine_model"));// set model your_data_model to Select element
            selectCuisine.bindAggregation("items","/mRoot",oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above

            //City model
            var mModel_city = new sap.ui.model.json.JSONModel("model/cityList.json");
            sap.ui.getCore().setModel(mModel_city, "city_model");
            var selectCity = this.byId("cityList");
            selectCity.setModel(sap.ui.getCore().getModel("city_model"));
            selectCity.bindAggregation("items", "/mRoot", oItemSelectTemplate);

            //Price model
            var mModel_price = new sap.ui.model.json.JSONModel("model/priceList.json");
            sap.ui.getCore().setModel(mModel_price, "price_model");
            var selectMinimumPrice = this.byId("minimumPriceList");
            var selectMaximumPrice = this.byId("maximumPriceList");
            selectMinimumPrice.setModel(sap.ui.getCore().getModel("price_model"));
            selectMaximumPrice.setModel(sap.ui.getCore().getModel("price_model"));
            selectMinimumPrice.bindAggregation("items", "/mRoot", oItemSelectTemplate);
            selectMaximumPrice.bindAggregation("items", "/mRoot", oItemSelectTemplate);



        },
        pressedButton: function(oEvent){
            //Fetch selected cuisine
            var cuisine = this.getView().byId("cuisineList").getSelectedItem().getText();
            var cuisineKey = this.getView().byId("cuisineList").getSelectedKey();

            //Fetch selected country
            var city = this.getView().byId("cityList").getSelectedItem().getText();
            var cityKey = this.getView().byId("cityList").getSelectedKey();

            //Fetch selected minimum price
            var minPrice = this.getView().byId("minimumPriceList").getSelectedItem().getText();
            var minPriceKey = this.getView().byId("minimumPriceList").getSelectedKey();

            //Fetch selected maximum price
            var maxPrice = this.getView().byId("maximumPriceList").getSelectedItem().getText();
            var maxPriceKey = this.getView().byId("maximumPriceList").getSelectedKey();

            if(minPriceKey != 0 && maxPriceKey != 0 && maxPriceKey < minPriceKey){
                MessageToast.show("Minimum price can not be higher than maximum price!");
            } else{
                //Send API post
                console.log(new Uint8Array(arrayBuffer));
                sap.ui.core.BusyIndicator.show(0);
                var subscriptionKey = "22fa552b658b4694ab39a37ec10a039f";
                var uriBase = "http://127.0.0.1:5000/";


                var that = this;
                $.ajax({
                    method: "GET",
                    url: uriBase,
                    dataType: "JSON",
                    data: {
                        'city' : city,
                        'cuisine' : cuisine,
                        'minPrice' : minPrice,
                        'maxPrice' : maxPrice
                    }
                }).done(function(data){
                    console.log(data);
                    that.displayResult(data.about);
                    sap.ui.core.BusyIndicator.hide();


                });


            }

            //MessageToast.show(cuisineKey + countryKey + minPriceKey + maxPriceKey);
        },

        displayResult: function(data){
            MessageToast.show(data);
        },








        //reset the UI
        clearModel(){

        }
    });
});