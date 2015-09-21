awk '{print $8}' data/access-1.log | # Split by whitespace, 7th field is request path
    sort                    | # Make occurrences of the same URL appear consecutively in file
    uniq -c                 | # Replace consecutive occurrences of the same URL with a count
    sort -rn                | # Sort by number of occurrences, descending
    head -n 5                 # Output top 5 URLs