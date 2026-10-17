$base = "http://localhost:3000"
$h = @{ "Content-Type" = "application/json" }

function PatchCat($id, $name, $slug, $image, $desc, $homepage, $order) {
    $body = @{ id=$id; name=$name; slug=$slug; image=$image; description=$desc; show_on_homepage=$homepage; sort_order=$order }
    $json = $body | ConvertTo-Json -Depth 3
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    try {
        $r = Invoke-RestMethod -Uri "$base/api/categories" -Method PATCH -Headers $h -Body $bytes
        Write-Host "PATCH $name : success=$($r.success)" -ForegroundColor Green
    } catch {
        # If PATCH fails (doesn't exist), try POST
        try {
            $r2 = Invoke-RestMethod -Uri "$base/api/categories" -Method POST -Headers $h -Body $bytes
            Write-Host "POST $name : success=$($r2.success)" -ForegroundColor Cyan
        } catch {
            Write-Host "FAIL $name : $_" -ForegroundColor Red
        }
    }
}

PatchCat `
    "cat-mutton" `
    "Mutton" `
    "mutton" `
    "https://images.unsplash.com/photo-1588347818036-5f8d2b02b4ee?w=600&q=80&auto=format" `
    "Premium halal mutton and individual cuts sourced from quality-assured farms." `
    $true `
    2

PatchCat `
    "cat-beef" `
    "Beef" `
    "beef" `
    "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600&q=80&auto=format" `
    "Premium halal beef cuts including chuck, tenderloin, brisket in bulk supply." `
    $true `
    3

Write-Host "Done."
