function PostAction(eventName, itemData, id, propertyName) {
  disableInventory(500);
  if (itemData.type != "item_weapon") {
    dialog.prompt({
      title: LANGUAGE.prompttitle,
      button: LANGUAGE.promptaccept,
      required: true,
      item: itemData,
      type: itemData.type,
      input: {
        type: "number",
        autofocus: "true",
      },

      validate: function (value, item, type) {
        if (!value || value <= 0 || value > 200 || !isInt(value)) {
          dialog.close();
          return;
        } else {
          if (!isValidating) {
            processEventValidation();
            $.post(
              `https://${GetParentResourceName()}/${eventName}`,
              JSON.stringify({
                item: itemData,
                type: type,
                number: value,
                [propertyName]: id,
              })
            );
          }
        }
      },
    });
  } else {
    if (!isValidating) {
      processEventValidation();
      $.post(
        `https://${GetParentResourceName()}/${eventName}`,
        JSON.stringify({
          item: itemData,
          type: itemData.type,
          number: 1,
          [propertyName]: id,
        })
      );
    }
  }
}
const ActionTakeList = {
  custom: { action: "TakeFromCustom", id: () => customId },
  cart: { action: "TakeFromCart", id: () => wagonid },
  house: { action: "TakeFromHouse", id: () => houseId },
  hideout: { action: "TakeFromHideout", id: () => hideoutid },
  bank: { action: "TakeFromBank", id: () => bankId },
  clan: { action: "TakeFromClan", id: () => clanid },
  steal: { action: "TakeFromSteal", id: () => stealid },
  Container: { action: "TakeFromContainer", id: () => Containerid },
  horse: { action: "TakeFromHorse", id: () => horseid },
};

const ActionMoveList = {
  custom: { action: "MoveToCustom", id: () => customId },
  cart: { action: "MoveToCart", id: () => wagonid },
  house: { action: "MoveToHouse", id: () => houseId },
  hideout: { action: "MoveToHideout", id: () => hideoutid },
  bank: { action: "MoveToBank", id: () => bankId },
  clan: { action: "MoveToClan", id: () => clanid },
  steal: { action: "MoveToSteal", id: () => stealid },
  Container: { action: "MoveToContainer", id: () => Containerid },
  horse: { action: "MoveToHorse", id: () => horseid },
};

function initSecondaryInventoryHandlers() {
  $("#inventoryElement").droppable({
    drop: function (event, ui) {
      itemData = ui.draggable.data("item");
      itemInventory = ui.draggable.data("inventory");
      if (itemInventory === "second") {
        // get matching type from list
        if (type in ActionTakeList) {
          const { action, id } = ActionTakeList[type];
          const Id = id();
          if (type === "custom") {
            PostAction(action, itemData, Id, "id");
          } else {
            PostAction(action, itemData, Id, type);
          }
          //end
        } else if (type === "store") {
          disableInventory(500);
          if (itemData.type != "item_weapon") {
            dialog.prompt({
              title: LANGUAGE.prompttitle,
              button: LANGUAGE.promptaccept,
              required: true,
              item: itemData,
              type: itemData.type,
              input: {
                type: "number",
                autofocus: "true",
              },

              validate: function (value, item, type) {
                if (!value) {
                  dialog.close();
                  return;
                }

                if (!isInt(value)) {
                  return;
                }

                if (!isValidating) {
                  processEventValidation();
                  $.post(
                    `https://${GetParentResourceName()}/TakeFromStore`,
                    JSON.stringify({
                      item: itemData,
                      type: type,
                      number: value,
                      price: itemData.price,
                      geninfo: geninfo,
                      store: StoreId,
                    })
                  );
                }
              },
            });
          } else {
            if (!isValidating) {
              processEventValidation();
              $.post(
                `https://${GetParentResourceName()}/TakeFromStore`,
                JSON.stringify({
                  item: itemData,
                  type: itemData.type,
                  number: 1,
                  price: itemData.price,
                  geninfo: geninfo,
                  store: StoreId,
                })
              );
            }
          }
        }
      }
    },
  });

  $("#secondInventoryElement").droppable({
    drop: function (event, ui) {
      itemData = ui.draggable.data("item");
      itemInventory = ui.draggable.data("inventory");

      if (itemInventory === "main") {
        if (type in ActionMoveList) {
          const { action, id } = ActionMoveList[type];
          const Id = id();
          if (type === "custom") {
            PostAction(action, itemData, Id, "id");
          } else {
            PostAction(action, itemData, Id, type);
          }
        } else if (type === "store") {
          disableInventory(500);
          // this action is different than all the others
          if (itemData.type != "item_weapon") {
            dialog.prompt({
              title: LANGUAGE.prompttitle,
              button: LANGUAGE.promptaccept,
              required: true,
              item: itemData,
              type: itemData.type,
              input: {
                type: "number",
                autofocus: "true",
              },
              validate: function (value, item, type) {
                if (!value) {
                  dialog.close();
                  return;
                }

                if (!isInt(value)) {
                  return;
                }

                if (geninfo.isowner != 0) {
                  if (!isValidating) {
                    processEventValidation();
                    dialog.prompt({
                      title: LANGUAGE.prompttitle2,
                      button: LANGUAGE.promptaccept,
                      required: true,
                      item: itemData,
                      type: itemData.type,
                      input: {
                        type: "number",
                        autofocus: "true",
                      },
                      validate: function (value2, item, type) {
                        if (!value2) {
                          dialog.close();
                          return;
                        }

                        if (!isValidating) {
                          processEventValidation();
                          $.post(
                            `https://${GetParentResourceName()}/MoveToStore`,
                            JSON.stringify({
                              item: itemData,
                              type: type,
                              number: value,
                              price: value2,
                              geninfo: geninfo,
                              store: StoreId,
                            })
                          );
                        }
                      },
                    });
                  }
                } else {
                  if (!isValidating) {
                    processEventValidation();
                    $.post(
                      `https://${GetParentResourceName()}/MoveToStore`,
                      JSON.stringify({
                        item: itemData,
                        type: type,
                        number: value,
                        geninfo: geninfo,
                        store: StoreId,
                      })
                    );
                  }
                }
              },
            });
          } else {
            if (geninfo.isowner != 0) {
              dialog.prompt({
                title: LANGUAGE.prompttitle2,
                button: LANGUAGE.promptaccept,
                required: true,
                item: itemData,
                type: itemData.type,
                input: {
                  type: "number",
                  autofocus: "true",
                },
                validate: function (value2, item, type) {
                  if (!value2) {
                    dialog.close();
                    return;
                  }

                  if (!isValidating) {
                    processEventValidation();
                    $.post(
                      `https://${GetParentResourceName()}/MoveToStore`,
                      JSON.stringify({
                        item: itemData,
                        type: itemData.type,
                        number: 1,
                        price: value2,
                        geninfo: geninfo,
                        store: StoreId,
                      })
                    );
                  }
                },
              });
            } else {
              if (!isValidating) {
                processEventValidation();
                $.post(
                  `https://${GetParentResourceName()}/MoveToStore`,
                  JSON.stringify({
                    item: itemData,
                    type: itemData.type,
                    number: 1,
                    geninfo: geninfo,
                    store: StoreId,
                  })
                );
              }
            }
          }
        }
      }
    },
  });
}

function secondInventorySetup(items) {
  $("#inventoryElement").html("");
  $("#secondInventoryElement").html("");

  $.each(items, function (index, item) {
    count = item.count;

    if (item.type !== "item_weapon") {
      $("#secondInventoryElement").append(`
      <div data-label="${item.label}"' 
      style='background-image: url(\"img/items/${
        item.name ? item.name.toLowerCase() : ""
      }.png\"), url(); background-size: 90px 90px, 90px 90px; background-repeat: no-repeat; background-position: center;'
      id="item-${index}" class='item'>
          ${count > 0 ? `<div class='count'>${count}</div>` : ``}
          <div class='text'></div>
      </div>
  `);
    } else {
      $("#secondInventoryElement").append(
        "<div data-label='" +
          item.label +
          "' style='background-image: url(\"img/items/" +
          item.name.toLowerCase() +
          ".png\"), url(); background-size: 90px 90px, 90px 90px; background-repeat: no-repeat; background-position: center;' id='item-" +
          index +
          "' class='item'></div></div>"
      );
    }

    $("#item-" + index).data("item", item);
    $("#item-" + index).data("inventory", "second");

    $("#item-" + index).hover(
      function () {
        OverSetTitleSecond(item.label);
      },
      function () {
        OverSetTitleSecond(" ");
      }
    );

    $("#item-" + index).hover(
      function () {
        if (!!item.metadata && !!item.metadata.description) {
          OverSetDescSecond(item.metadata.description);
        } else {
          OverSetDescSecond(!!item.desc ? item.desc : "");
        }
      },
      function () {
        OverSetDescSecond(" ");
      }
    );
  });
}
