function CreateList(listTitle, columnArrays) {
  var hostUrl = "/sites/354RANS/hafi/";
  var clientContext = new SP.ClientContext();
  var oWeb = clientContext.get_web();
  var value = listTitle;
  var listCreation = new SP.ListCreationInformation();
  listCreation.set_title(value);
  listCreation.set_templateType(SP.ListTemplateType.genericList);
  var mySpList = oWeb.get_lists().add(listCreation);
  var fieldCol = mySpList.get_fields();

  columnArrays.map((item) => {
    var spTxtField = fieldCol.addFieldAsXml(
      item.data,
      true,
      SP.AddFieldOptions.addToDefaultContentType,
    );
    spTxtField.set_title(item.title);
  });

  mySpList.update();
  clientContext.executeQueryAsync(
    function () {
      alert("successfully Created The List and List Field");
    },
    function (sender, args) {
      alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
    },
  );
}

//{title: 'name', data: '<Field Type="Text" DisplayName="name" Name="name" />'},

let colInfo = [
  {
    title: "serialNumber",
    data: '<Field Type="Text" DisplayName="serialNumber" Name="serialNumber" />',
  },
  {
    title: "systemType",
    data: '<Field Type="Text" DisplayName="systemType" Name="systemType" />',
  },
  {
    title: "schedulableItem",
    data: '<Field Type="Text" DisplayName="schedulableItem" Name="schedulableItem" />',
  },
  {
    title: "location",
    data: '<Field Type="Text" DisplayName="location" Name="location" />',
  },
  {
    title: "pointLocationLat",
    data: '<Field Type="Text" DisplayName="pointLocationLat" Name="pointLocationLat" />',
  },
  {
    title: "pointLocationLon",
    data: '<Field Type="Text" DisplayName="pointLocationLon" Name="pointLocationLon" />',
  },
  {
    title: "deviceType",
    data: '<Field Type="Text" DisplayName="deviceType" Name="deviceType" />',
  },
  {
    title: "threat",
    data: '<Field Type="Text" DisplayName="threat" Name="threat" />',
  },
  {
    title: "mxCondition",
    data: '<Field Type="Text" DisplayName="mxCondition" Name="mxCondition" />',
  },
  {
    title: "status",
    data: '<Field Type="Text" DisplayName="status" Name="status" />',
  },
  {
    title: "ETIC",
    data: '<Field Type="Text" DisplayName="ETIC" Name="ETIC" />',
  },
  {
    title: "remarks",
    data: '<Field Type="Text" DisplayName="remarks" Name="remarks" />',
  },
  {
    title: "statusChangeDate",
    data: '<Field Type="Text" DisplayName="statusChangeDate" Name="statusChangeDate" />',
  },
  {
    title: "operationalStatus",
    data: '<Field Type="Text" DisplayName="operationalStatus" Name="operationalStatus" />',
  },
];

CreateList("threatList", colInfo);

function isCurrentUserSiteAdmin(OnSuccess, OnError) {
  var context = SP.ClientContext.get_current();
  var user = context.get_web().get_currentUser();
  context.load(user);

  context.executeQueryAsync(function () {
    var isSiteAdmin = user.get_isSiteAdmin();
    OnSuccess(isSiteAdmin);
  }, OnError);
}

//Usage
isCurrentUserSiteAdmin(
  function (isAdmin) {
    console.log(isAdmin);
  },
  function (sender, args) {
    console.log("An error occured: " + args.get_message());
  },
);
