---@alias sourceId string
---@alias itemId string
---@alias weaponId string
---@alias invId string

---@type table<invId, table<sourceId, table<itemId, Item>>|table<itemId, Item>>
UsersInventories = {
	default = {}
}

---@type table<invId, table<weaponId, Weapon>>
UsersWeapons = {
	default = {}
}
---@type table<string, Item>
svItems = {}


function LoadDatabase(charid)
	exports.oxmysql:execute('SELECT * FROM loadout ', {}, function(result)
		if next(result) then
			for _, db_weapon in pairs(result) do
				if tonumber(charid) == tonumber(db_weapon.charidentifier) then
					local ammo = json.decode(db_weapon.ammo)
					local comp = json.decode(db_weapon.components)
					local charId = nil
					local used = false
					local used2 = false

					if db_weapon.charidentifier ~= nil then
						charId = db_weapon.charidentifier
					end

					if db_weapon.used == 1 then
						used = true
					end

					if db_weapon.used2 == 1 then
						used2 = true
					end

					if db_weapon.dropped == 0 then
						local weapon = Weapon:New({
							id = db_weapon.id,
							propietary = db_weapon.identifier,
							name = db_weapon.name,
							ammo = ammo,
							components = comp,
							used = used,
							used2 = used2,
							charId = charId,
							currInv = db_weapon.curr_inv,
							dropped = db_weapon.dropped
						})

						if UsersWeapons[db_weapon.curr_inv] == nil then
							UsersWeapons[db_weapon.curr_inv] = {}
						end

						UsersWeapons[db_weapon.curr_inv][weapon:getId()] = weapon
					elseif db_weapon.dropped == 1 then
						-- delete from database this will help clean up the databse
						exports.oxmysql:execute('DELETE FROM loadout WHERE id = ?', {db_weapon.id})
					end
				end
			end
		end
	end)
end

-- load weapons only for the character that its joining
RegisterNetEvent("vorp:SelectedCharacter", function(source, character)
	local charid = character.charIdentifier
	LoadDatabase(charid)
end)

-- load all items from database
Citizen.CreateThread(function()
	exports.oxmysql:execute('SELECT * FROM items', {}, function(result)
		if next(result) ~= nil then
			for _, db_item in pairs(result) do
				local item = Item:New({
					id = db_item.id,
					item = db_item.item,
					metadata = db_item.metadata or {},
					label = db_item.label,
					limit = db_item.limit,
					type = db_item.type,
					canUse = db_item.usable,
					canRemove = db_item.can_remove,
					desc = db_item.desc
				})
				svItems[item.item] = item
			end
		end
	end)
end)
