-- Configuration: Map your Discord Role IDs to Staff Ranks and Priorities
-- Higher priority number means higher rank display order
local staffRoles = {
    ["YOUR_OWNER_ROLE_ID"] = { name = "Owner", priority = 5 },
    ["YOUR_ADMIN_ROLE_ID"] = { name = "Admin", priority = 4 },
    ["YOUR_MOD_ROLE_ID"] = { name = "Moderator", priority = 3 },
    ["YOUR_TRIAL_MOD_ROLE_ID"] = { name = "Trial Staff", priority = 2 }
}

RegisterNetEvent('nexus:server:requestStaffMembers', function()
    local src = source
    local activeStaff = {}

    -- Fetch connected players
    for _, playerId in ipairs(GetPlayers()) do
        local discordId = exports.Badger_Discord_API:GetDiscordIdentifier(playerId)
        
        if discordId then
            local highestPriority = 0
            local assignedRoleName = nil

            -- Check player's roles against configuration table
            for roleId, roleData in pairs(staffRoles) do
                if exports.Badger_Discord_API:CheckRole(playerId, roleId) then
                    if roleData.priority > highestPriority then
                        highestPriority = roleData.priority
                        assignedRoleName = roleData.name
                    end
                end
            end

            -- If player holds a staff role, add them to the telemetry list
            if assignedRoleName then
                local playerName = GetPlayerName(playerId)
                local discordAvatar = exports.Badger_Discord_API:GetDiscordAvatar(playerId) or "Nexus Logo.jpg"

                table.insert(activeStaff, {
                    name = playerName,
                    role = assignedRoleName,
                    avatar = discordAvatar,
                    priority = highestPriority
                })
            end
        end
    end

    -- Sort staff list by priority descending
    table.sort(activeStaff, function(a, b)
        return a.priority > b.priority
    end)

    -- Send data back to the requesting client
    TriggerClientEvent('nexus:client:receiveStaffMembers', src, activeStaff)
end)