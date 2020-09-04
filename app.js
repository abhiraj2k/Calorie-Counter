// Storage Controller
const StorageCtrl = (function(){
    // Public methods
    return{
        // Store items
        storeItem: function(item){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage:function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(item.id === updatedItem.id){
                    items.splice(index,1,updatedItem);
                }
            })
            localStorage.setItem('items',JSON.stringify(items));
        },
        deleteItemFromStorage:function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(item.id === id){
                    items.splice(index,1);
                }
            })
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearAllFromStorage(){
            localStorage.removeItem('items');
        }
    }
})();
// Item Conrtroller
 const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // data Structure / State
        const data = {
            items:StorageCtrl.getItemsFromStorage(),
            currentItem : null,
            totalCalories : 0
        }
        return{
            // Publically Accessible Functions
            getItems: function(){
                return data.items;
            },

            // Add item to data structure
            addItem: function(name,calories){
                let ID;
                if(data.items.length > 0){
                    ID = data.items[data.items.length-1].id+1;
                }else{
                    ID = 0;
                }
                // Calories to int
                calories = parseInt(calories);

                const newItem = new Item(ID, name, calories);
                // ADD to items array
                data.items.push(newItem);
                return newItem;
            },

            // Get item by id from data structure
            getItemById: function(id){
                found = null;
                data.items.forEach(function(item){
                    if(item.id === id){
                        found = item;
                    }
                })
                return found;
            },

            // Update item to data structure
            updateItem: function(name,calories){
                // calories to number
                calories = parseInt(calories);

                let found = null;
                data.items.forEach(function(item){
                    if(item.id === data.currentItem.id){
                        item.name = name;
                        item.calories = calories;
                        found = item
                    }
                })
                return found;
            },

            // Delete item from data structure
            deleteItem: function(id){
                
                // Get ids
                const ids = data.items.map(function(item){
                    return item.id;
                })
                // Get index of that id
                const index = ids.indexOf(id);
                // Remove from data structure
                data.items.splice(index,1);
            },


            // Clear all items
            clearAllItems: function(){
                data.items = [];
            },

            // Set currentitem to data structure
            setCurrentItem: function(item){
                data.currentItem = item;
            },

            // get currentitem from daata structure
            getCurrentItem: function(){
                return data.currentItem;
            },

            // Get total calories
            getTotalCalories: function(){
                let total =0 ;
                data.items.forEach(function(item){
                    total += item.calories;
                })
                data.totalCalories = total;
                return total;   
            },
            
            // log data function
            logData : function(){
                return data;
            }
            
        }
 })();


// UI Controller
const UICtrl = (function(){
    // UI selectors 
        const UISelectors = {
            itemList : '#item-list',
            listItems: '#item-list li',
            addBtn: '.add-btn',
            updateBtn: '.update-btn',
            deleteBtn: '.delete-btn',
            backBtn: '.back-btn',
            clearBtn:'.clear-btn',
            itemNameInput: '#item-name',
            itemCaloriesInput: '#item-calories',
            totalCalories: '.total-calories'
        }
        return{
            // Display to item list
            populateItemList: function(items){
                let html = '';
                items.forEach(function(item){
                    html+=`<li class="collection-item" id="item-${item.id}"><strong>${item.name}:</strong><em> ${item.calories} calories</em>
                    <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></li>`;
                })
                document.querySelector(UISelectors.itemList).innerHTML = html;
            },

            // Get input from ui/user
            getItemInput: function(){
                return{
                    name:document.querySelector(UISelectors.itemNameInput).value,
                    calories:document.querySelector(UISelectors.itemCaloriesInput).value
                }
            },

            // Add item to list in ui
            addListItem : function(item){
                document.querySelector(UISelectors.itemList).style.display = 'block';
                // Create li element
                const li = document.createElement('li');
                // Add class
                li.className = `collection-item`;
                // Add id
                li.id = `item-${item.id}`;
                // Add HTML
                li.innerHTML = `<strong>${item.name}:</strong><em> ${item.calories} calories</em>
                <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                // Insert item 
                document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
            },

            // Update item to list in ui
            updateListItem: function(item){
                let listItems = document.querySelectorAll(UISelectors.listItems);
                
                listItems = Array.from(listItems);

                listItems.forEach(function(listItem){
                    const itemID = listItem.getAttribute('id');
                    if(itemID === `item-${item.id}`){
                        document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong><em> ${item.calories} calories</em>
                        <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
                    }
                })
                
            },

            // Delete list item from ui
            deleteListItem: function(id){
                // Set as #item-'id'
                const itemID = `#item-${id}`;
                // Selecting the list element
                item = document.querySelector(itemID)
                // Remove
                item.remove();
            },

            // Clear list items
            clearListItems : function(){
                // Grab all list items
                let listItems = document.querySelectorAll(UISelectors.listItems);
                // Turn node list to array
                listItems = Array.from(listItems);
                listItems.forEach(function(item){
                    item.remove();
                })
            },
            // Show calories to ui
            showCalories:function(calories){
                document.querySelector(UISelectors.totalCalories).innerHTML = calories;
            },

            // Clear input fields
            clearInput: function(){
                document.querySelector(UISelectors.itemNameInput).value = '';
                document.querySelector(UISelectors.itemCaloriesInput).value = '';
            },

            // Add item to input fields 
            addItemToForm : function(){
                document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
                document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
                // Show edit state
                UICtrl.showEditState();
            },

            // Hide the list
            hideList: function(){
                document.querySelector(UISelectors.itemList).style.display = 'none';
            },

            // Clear the edit state
            clearEditState: function(){
                UICtrl.clearInput();
                document.querySelector(UISelectors.updateBtn).style.display = 'none';
                document.querySelector(UISelectors.deleteBtn).style.display = 'none';
                document.querySelector(UISelectors.backBtn).style.display = 'none';
                document.querySelector(UISelectors.addBtn).style.display = 'inline';
                 
            },

            // Show edit state
            showEditState: function(){
                document.querySelector(UISelectors.updateBtn).style.display = 'inline';
                document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
                document.querySelector(UISelectors.backBtn).style.display = 'inline';
                document.querySelector(UISelectors.addBtn).style.display = 'none';
            },

            // Get the ui selectors
            getSelectors: function(){
                return UISelectors;
            }
        }
})();


// App Controller
const App = (function(ItemCtrl,UICtrl,StorageCtrl){

    // Load Event Listeners
        const loadEventListeners = function(){

            // Getting UI Selectors
            const UISelectors = UICtrl.getSelectors();

            // Disable Enter button
            document.addEventListener('keypress',function(e){
                if(e.keyCode === 13 || e.which === 13){
                    e.preventDefault();
                    return false;
                }
            })

            // Show total calories
            
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Show total calories
            UICtrl.showCalories(totalCalories); 

            // Add item event
            document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
            // Edit icon click event
            document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
            // Update button
            document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
            // Back button
            document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
            // Delete button
            document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
            // Clear button
            document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    
    // Add item submit
    const itemAddSubmit = function(e){
        
        const input = UICtrl.getItemInput();
        if(input.name !== '' && input.calories !== ''){
            // Add to Data Structure
            const newItem = ItemCtrl.addItem(input.name,input.calories);
            // Add to UI
            UICtrl.addListItem(newItem);
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Show total calories
            UICtrl.showCalories(totalCalories);
            // Add to local storage
            StorageCtrl.storeItem(newItem);
            // Clear Fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }


    // Item edit click
    const itemEditClick = function(e){

        if(e.target.classList.contains('edit-item')){
            // selecting parent node's id
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into array
            const listIdArr = listId.split('-');
            // Get the actual ID
            const id = parseInt(listIdArr[1]);
            // Get item from data structure
            const itemToEdit = ItemCtrl.getItemById(id);
            // Set it as currentitem
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to input fields in ui
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }


    // Item update submit
    const itemUpdateSubmit = function(e){
        // get item input from user
        const input = UICtrl.getItemInput();
        // update item in data structure
        const updatedItem = ItemCtrl.updateItem(input.name,input.calories);
        // update in UI
        UICtrl.updateListItem(updatedItem);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Show total calories
        UICtrl.showCalories(totalCalories);
        // Update items to Local Storage
        StorageCtrl.updateItemStorage(updatedItem);
        // Clear edit state
        UICtrl.clearEditState();
        e.preventDefault();
    }

    // Item delete submit
    const itemDeleteSubmit = function(e){

        // Get currentItem
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Show total calories
        UICtrl.showCalories(totalCalories);
        // Delete from localstorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        // Clear edit state
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear items
    const clearAllItemsClick = function(){
        // Clear all items from data structures
        ItemCtrl.clearAllItems();
        // Clear all items from ui
        UICtrl.clearListItems();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Clear all from storage
        StorageCtrl.clearAllFromStorage();
        // Show total calories
        UICtrl.showCalories(totalCalories);

        // Hide list
        UICtrl.hideList();
    }
    return{
        // Initialize function
        init: function(){

            // Clear edit state
            UICtrl.clearEditState();

            // Populate the list items
            const items = ItemCtrl.getItems();
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                
                UICtrl.populateItemList(items);
            }

            // Load event listeners initialization
            loadEventListeners();
        }
    }
})(ItemCtrl,UICtrl,StorageCtrl);

App.init();